import { redirect, Outlet, useParams, useNavigate, useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { FiLogOut, FiUser, FiHeart, FiCreditCard, FiDollarSign } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { MdOutlineSpaceDashboard } from 'react-icons/md'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import ProfileSidebarLink from '@/components/profile-layout/ProfileSidebarLink'
import FileUploadModalProvider from '@/providers/FileUploadModalProvider'

export const profileLayoutLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
            return redirect('/auth')
        }

        const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', sessionData.session.user.id).single()

        // Pretty sure that this will never be executed but still...
        if (profileError) {
            return redirect(`/profile/${sessionData.session.user.id}/404-not-found`)
        }

        return [sessionData.session, profileData]
    } catch (error) {
        throw new Error('ERROR_AT_PROFILE_LAYOUT_LOADER' + error)
    }
}

const ProfileLayout = () => {
    const [session, profile] = useLoaderData() as [Session, Database['public']['Tables']['profiles']['Row']]

    const { userId } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        if (session.user.id !== userId) {
            navigate(`/profile/${session.user.id}`)
        }
    }, [])

    const routes = [
        {
            to: `/profile/${session.user.id}`,
            end: true,
            icon: FiUser,
            label: 'Profile',
        }, {
            to: `/profile/${session.user.id}/orders`,
            icon: FiCreditCard,
            label: 'My Purchases',
        }, {
            to: `/profile/${session.user.id}/wishlist`,
            icon: FiHeart,
            label: 'My Wishlist',
        }, {
            to: `/profile/${session.user.id}/become-a-seller`,
            icon: FiDollarSign,
            label: 'Become a Seller',
            hidden: profile.role === 'SELLER',
        }, {
            to: `/profile/${session.user.id}/seller-dashboard`,
            icon: MdOutlineSpaceDashboard,
            label: 'Seller Dashboard',
            hidden: profile.role !== 'SELLER',
        }
    ]

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleLogOutButtonClick = async () => {
        try {
            setIsLoading(true)

            const { error } = await supabase.auth.signOut()

            // Pretty sure that this will never be executed but still...
            if (error) {
                toast.error('Something went wrong, please try again later.')
            } else {
                window.location.assign('/')
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    if (session.user.id !== userId) {
        return null
    }

    return (
        <>
            <FileUploadModalProvider />
            <div className="h-full flex gap-x-2">
                <aside className="lg:w-full min-w-fit max-w-xs h-fit min-h-screen flex flex-col gap-y-2 sticky top-0 py-2 px-4 border border-gray-200 shadow-lg shadow-gray-200">
                    <div className="flex items-center gap-x-2 py-2 px-4 rounded border border-gray-200 text-gray-700 text-center font-semibold">

                        {profile.avatar_url ? (
                            <img className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200" src={profile.avatar_url as string} alt={profile.full_name as string} />
                        ) : (
                            <span className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-100 border border-gray-200">{profile.full_name?.slice(0, 2).toUpperCase()}</span>
                        )}

                        <span className="flex-1 hidden lg:inline-block">{profile.full_name}</span>
                    </div>
                    <nav className="flex-1 space-y-1" id="profileLayoutSidebar">

                        {routes.map((route, index) => (
                            <ProfileSidebarLink key={index} hidden={route.hidden} to={route.to} end={route.end} icon={route.icon} label={route.label} />
                        ))}

                    </nav>
                    <button className="flex justify-center items-center gap-x-2 py-2 bg-yellow-ochre hover:bg-yellow-ochre-2 transition-all text-white font-semibold rounded-full" disabled={isLoading} onClick={handleLogOutButtonClick}>
                        <FiLogOut className="w-5 h-5" />
                        <span className="text-sm hidden lg:inline-block">Log out</span>
                    </button>
                </aside>
                <div className="flex-1 border border-gray-200 shadow-lg shadow-gray-200">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default ProfileLayout