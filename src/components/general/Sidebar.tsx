import { useLocation, Link } from 'react-router-dom'
import { IoMdClose } from 'react-icons/io'
import { Session } from '@supabase/supabase-js'
import { FiLogIn } from 'react-icons/fi'

import LogoLink from '@/components/general/LogoLink'
import IconButton from '@/components/general/IconButton'
import NavbarLink from '@/components/general/NavbarLink'
import { Database } from '@/utils/supabaseTypes'

interface SidebarProps {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
    session: Session | null,
    profile: Database['public']['Tables']['profiles']['Row'] | null,
}

const Sidebar: React.FC<SidebarProps> = ({
    setIsSidebarOpen,
    session,
    profile,
}) => {
    const location = useLocation()

    const routes = [
        {
            to: '/',
            label: 'Home',
            end: true,
        }, {
            to: '/categories',
            label: 'Browse Categories',
        }, {
            to: `/profile/${session?.user.id}/seller-dashboard`,
            label: 'Seller Dashboard',
        }, {
            to: `/profile/${session?.user.id}/wishlist`,
            label: 'Wishlist',
        },
    ]

    return (
        <div className="lg:hidden fixed inset-0 z-50" id="sidebar">
            <div className="relative w-full max-w-xs h-full ml-auto bg-black/95 py-20 px-10 flex flex-col items-center justify-between">
                <IconButton className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2" icon={IoMdClose} onClick={() => setIsSidebarOpen(false)} />
                <LogoLink to={location.pathname} />
                <div className="flex w-full flex-col gap-y-2 items-center">

                    {routes.map((route, index) => (
                        <NavbarLink key={index} className="bg-transparent w-full" to={route.to} end={route.end} label={route.label} onClick={() => setIsSidebarOpen(false)} />
                    ))}

                    {!session ? (
                        <Link className="w-full flex items-center gap-x-2 text-white bg-yellow-ochre hover:bg-yellow-ochre-2 transition-all py-2 px-4 rounded-full font-semibold flex-shrink-0" to="/auth" onClick={() => setIsSidebarOpen(false)}>
                            <FiLogIn className="w-5 h-5" />
                            <span className="text-sm">Log in</span>
                        </Link>
                    ) : (
                        <Link className="w-fit rounded-full border border-gray-200 overflow-hidden" to={`/profile/${session.user.id}`} onClick={() => setIsSidebarOpen(false)}>

                            {profile?.avatar_url ? (
                                <img className="w-8 h-8 object-cover" src={profile.avatar_url} alt={profile.full_name as string} />
                            ) : (
                                <span className="w-8 h-8 font-semibold text-sm aspect-square flex justify-center items-center text-gray-700 bg-gray-100">{profile?.full_name?.slice(0, 2).toUpperCase()}</span>
                            )}

                        </Link>
                    )}

                </div>
                <div></div>
            </div>
        </div>
    )
}

export default Sidebar