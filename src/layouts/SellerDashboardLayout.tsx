import { redirect, useLoaderData, Outlet } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'

import supabase from '@/libs/supabaseClient'
import SellerDashboardLink from '@/components/seller-dashboard-layout/SellerDashboardLink'

export const sellerDashboardLayoutLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', sessionData.session?.user.id as string).single()

        if (profileData?.role === 'BUYER') {
            return redirect(`/profile/${sessionData.session?.user.id}/become-a-seller`)
        }

        return sessionData.session
    } catch (error) {
        throw new Error('ERROR_AT_SELLER_DASHBOARD_LAYOUT_LOADER' + error)
    }
}

const SellerDashboardLayout = () => {
    const session = useLoaderData() as Session

    const routes = [
        {
            to: `/profile/${session.user.id}/seller-dashboard`,
            end: true,
            label: 'Overview',
        }, {
            to: `/profile/${session.user.id}/seller-dashboard/products`,
            label: 'My Products',
        },
    ]

    return (
        <div className="h-full flex flex-col">
            <nav className="py-2 px-4 flex gap-x-2 border-b border-gray-200" id="sellerDashboardNavbar">

                {routes.map((route, index) => (
                    <SellerDashboardLink key={index} to={route.to} end={route.end} label={route.label} />
                ))}

            </nav>
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
}

export default SellerDashboardLayout