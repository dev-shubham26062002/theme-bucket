import { Outlet, useLoaderData } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { useState } from 'react'

import Navbar from '@/components/general/Navbar'
import Footer from '@/components/general/Footer'
import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import Sidebar from '@/components/general/Sidebar'

export const mainLayoutLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: profileData } = await supabase.from('profiles').select('*, liked_products(*)').eq('id', sessionData.session?.user.id as string).single()

        const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', false).single()

        return [sessionData.session, profileData, orderData]
    } catch (error) {
        throw new Error('ERROR_AT_MAIN_LAYOUT_LOADER' + error)
    }
}

const MainLayout = () => {
    const [session, profile, order] = useLoaderData() as [Session, (Database['public']['Tables']['profiles']['Row'] & { liked_products: Database['public']['Tables']['liked_products']['Row'][] | null }) | null, (Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null }) | null]

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

    return (
        <div className="h-full flex flex-col">

            {isSidebarOpen && (
                <Sidebar setIsSidebarOpen={setIsSidebarOpen} session={session} profile={profile} />
            )}

            <Navbar session={session} profile={profile} order={order} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout