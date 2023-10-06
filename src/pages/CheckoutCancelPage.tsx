import { useEffect, useState } from 'react'
import { redirect, useNavigate, useLoaderData, useParams } from 'react-router-dom'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'

export const checkoutCancelPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
            return redirect('/auth')
        }

        const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', false).single()

        return orderData
    } catch (error) {
        throw new Error('ERROR_AT_CHECKOUT_CANCEL_PAGE_LOADER' + error)
    }
}

const CheckoutCancelPage = () => {
    const order = useLoaderData() as Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null } | null
    const { orderId } = useParams()

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

    const [isLoading, _setIsLoading] = useState(true)

    useEffect(() => {
        if (orderId !== order?.id) {
            navigate(`/${orderId}/checkout/cancel/404-not-found`)
        }
    }, [orderId])

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
        <div className="h-full flex justify-center items-center">
            <div className="w-full md:max-w-md">
                <h1 className="text-gray-700 text-3xl font-bold text-center">Payment Failed!&nbsp;😔</h1>
                <p className="text-gray-400 font-medium mt-2 text-xl text-center">Not able to process payment. Redirecting to home page in {countdown} second{countdown === 1 ? '' : 's'}.</p>
            </div>
        </div>
    )
}

export default CheckoutCancelPage