import { redirect, useLoaderData } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import Button from '@/components/general/Button'
import toast from 'react-hot-toast'
import CartRow from '@/components/cart-page/CartRow'

export const cartPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
            return redirect('/auth')
        }

        const { data: orderData } = await supabase.from('orders').select('*, order_items(*, products(*, categories(*)))').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', false).single()

        return orderData
    } catch (error) {
        throw new Error('ERROR_AT_CART_PAGE_LOADER' + error)
    }
}

const CartPage = () => {
    const order = useLoaderData() as Database['public']['Tables']['orders']['Row'] & { order_items: (Database['public']['Tables']['order_items']['Row'] & { products: (Database['public']['Tables']['products']['Row'] & { categories: Database['public']['Tables']['categories']['Row'] | null }) | null })[] | null }

    const cartProducts = order?.order_items?.map(orderItem => orderItem.products) || []

    const totalAmount = order?.order_items?.reduce((accumulator, orderItem) => accumulator + orderItem.products?.price! || 0, 0) || 0

    const handleCheckout = async () => {
        try {
            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string)

            const { data: stripeSessionData, error: stripeSessionError } = await supabase.functions.invoke('create-checkout-session', {
                body: { origin: window.location.origin, orderId: order.id, checkoutProducts: cartProducts },
            })

            if (stripeSessionError) {
                toast.error('Something went wrong, please try again later.')
                return
            }

            const { sessionId } = stripeSessionData

            const result = await stripe?.redirectToCheckout({
                sessionId,
            })

            // Pretty sure that this will never be executed but still...
            if (result?.error) {
                toast.error('Something went wrong, please try again later.')
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl text-gray-700 text-center">Your&nbsp;<span className="text-2xl font-semibold uppercase">Cart ({cartProducts.length || 0})</span></h1>

            <div className="mt-10 flex flex-col-reverse md:flex-row gap-10">
                <div className="flex-1">
                    <h1 className="font-semibold text-lg text-gray-700">All Items</h1>
                    <div className="h-1 my-2 bg-gray-700"></div>

                    {cartProducts.length === 0 ? (
                        <p className="mt-4 p-10 flex justify-center items-center rounded-lg border border-gray-200 text-gray-400 font-medium">Your cart is empty.</p>
                    ) : (
                        <div className="mt-4">

                            {cartProducts.map((product, index) => (
                                <div key={index}>
                                    <CartRow to={`/categories/${product?.categories?.name}/products/${product?.id}`} imageSrc={product?.main_image_url!} name={product?.name!} price={product?.price!} orderId={order.id} productId={product?.id as string} />

                                    {index !== cartProducts.length - 1 && (
                                        <div className="h-px my-4 bg-gray-200"></div>
                                    )}

                                </div>
                            ))}

                        </div>
                    )}

                </div>
                <div className="w-full md:max-w-xs">
                    <h1 className="font-semibold text-lg text-gray-700">Cart Overview</h1>
                    <div className="h-1 my-2 bg-gray-700"></div>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">Total Items:</p>
                        <h1 className="text-gray-700 font-medium">{cartProducts.length || 0}</h1>
                    </div>
                    <div className="h-px my-2 bg-gray-200"></div>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">Total Amount:</p>
                        <h1 className="text-gray-700 font-medium">Rs. {totalAmount || 0}</h1>
                    </div>

                    {cartProducts.length !== 0 && (
                        <Button className="mt-10 w-full" label="Pay using Stripe" onClick={handleCheckout} />
                    )}
                </div>
            </div>
        </div >
    )
}

export default CartPage