import { useLoaderData } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'

import { Database } from '@/utils/supabaseTypes'
import supabase from '@/libs/supabaseClient'
import OrderCard from '@/components/orders-page/OrderCard'

export const ordersPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: ordersData } = await supabase.from('orders').select('*, order_items(*, products(*, categories(*), profiles(*), reviews(*))), purchased_products(*)').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', true).order('created_at', { ascending: false })

        return [sessionData.session, ordersData]
    } catch (error) {
        throw new Error('ERROR_AT_ORDERS_PAGE_LOADER' + error)
    }
}

const OrdersPage = () => {
    const [session, orders] = useLoaderData() as [Session, (Database['public']['Tables']['orders']['Row'] & { order_items: (Database['public']['Tables']['order_items']['Row'] & { products: (Database['public']['Tables']['products']['Row'] & { categories: Database['public']['Tables']['categories']['Row'] | null, profiles: Database['public']['Tables']['profiles']['Row'] | null, reviews: Database['public']['Tables']['reviews']['Row'][] | null }) | null })[] | null, purchased_products: Database['public']['Tables']['purchased_products']['Row'][] | null })[] | null]

    return (
        <div className="p-10">
            <h1 className="text-2xl text-gray-700 text-center">My&nbsp;<span className="text-2xl font-semibold uppercase">Purchases</span></h1>

            {orders?.length === 0 ? (
                <p className="mt-10 p-10 flex justify-center items-center text-center rounded-lg border border-gray-200 text-gray-400 font-medium">You haven't purchased anything yet.</p>
            ) : (
                <div className="mt-10">

                    {orders?.map((order, index) => (
                        <OrderCard key={index} orderId={order.id} completedAt={order.updated_at} order={order} session={session} />
                    ))}

                </div >
            )}

        </div >
    )
}

export default OrdersPage