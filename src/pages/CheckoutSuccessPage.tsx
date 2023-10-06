import ReactConfetti from 'react-confetti'
import { useState, useEffect } from 'react'
import { useNavigate, redirect, useLoaderData, useParams } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import uniqid from 'uniqid'

import { Database } from '@/utils/supabaseTypes'
import supabase from '@/libs/supabaseClient'

export const checkoutSuccessPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
            return redirect('/auth')
        }

        const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', false).single()

        return [sessionData.session, orderData]
    } catch (error) {
        throw new Error('ERROR_AT_CHECKOUT_CANCEL_PAGE_LOADER' + error)
    }
}

const CheckoutSuccessPage = () => {
    const [session, order] = useLoaderData() as [Session, Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null } | null]

    const { orderId } = useParams()

    useEffect(() => {
        const handleOrder = async () => {
            try {
                if (orderId !== order?.id) {
                    navigate(`/${orderId}/checkout/success/404-not-found`)
                    return
                }

                const transactionId = `${Date.now()}-${uniqid()}`

                const { error: updateOrderError } = await supabase.from('orders').update({ is_completed: true, transaction_id: transactionId }).eq('id', order?.id as string)

                // Pretty sure this will never happen, but just in case
                if (updateOrderError) {
                    toast.error('Something went wrong, please try again later.')
                    navigate('/')
                    return
                }

                const { error: purchasedProductsError } = await supabase
                    .from('purchased_products')
                    .insert(order?.order_items?.map((item) => ({
                        user_id: session.user.id,
                        product_id: item.product_id,
                        order_id: order.id,
                    })) as Database['public']['Tables']['purchased_products']['Insert'][])

                // Pretty sure this will never happen, but just in case
                if (purchasedProductsError) {
                    toast.error('Something went wrong, please try again later.')
                    navigate('/')
                    return
                }
            } catch (error) {
                toast.error('Something went wrong, please try again later.')
                navigate('/')
            } finally {
                setIsLoading(false)
            }
        }

        handleOrder()
    }, [orderId])

    const [isLoading, setIsLoading] = useState(true)

    const [countdown, setCountdown] = useState(5)

    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setCountdown(countdown - 1)
        }, 1000)

        if (countdown === 0) {
            clearTimeout(timer)
            navigate('/')
        }

        return () => clearTimeout(timer)
    }, [countdown])

    if (isLoading) {
        return (
            <div className="h-full flex justify-center items-center">
                <div className="w-full md:max-w-md">
                    <h1 className="text-gray-700 text-3xl font-bold text-center">Processing Payment...&nbsp;🤔</h1>
                    <p className="text-gray-400 font-medium mt-2 text-xl text-center">Please wait while we process your payment.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full relative flex justify-center items-center">
            <ReactConfetti className="z-50 absolute inset-0" />
            <div className="w-full md:max-w-md">
                <h1 className="text-gray-700 text-3xl font-bold text-center">Payment Successful!&nbsp;🎉</h1>
                <p className="text-gray-400 font-medium mt-2 text-xl text-center">Thank you for your purchase. Redirecting to home page in {countdown} second{countdown === 1 ? '' : 's'}.</p>
            </div>
        </div >
    )
}

export default CheckoutSuccessPage