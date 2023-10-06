import { FiHeart, FiLogIn, FiMenu, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'

import NavbarLink from '@/components/general/NavbarLink'
import LogoLink from '@/components/general/LogoLink'
import { Database } from '@/utils/supabaseTypes'
import WishlistOrCartLink from '@/components/general/WishlistOrCartLink'
import IconButton from '@/components/general/IconButton'
import Searchbar from './Searchbar'

interface NavbarProps {
    session: Session | null,
    profile: (Database['public']['Tables']['profiles']['Row'] & { liked_products: Database['public']['Tables']['liked_products']['Row'][] | null }) | null,
    order: (Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null }) | null,
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const Navbar: React.FC<NavbarProps> = ({
    session,
    profile,
    order,
    setIsSidebarOpen,
}) => {
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
        <header>
            <div className="py-6 px-10 flex justify-between items-center gap-x-2">
                <LogoLink to="/" variant="colorful" />
                <div className="hidden lg:block flex-1">
                    <Searchbar className="mx-auto max-w-lg" />
                </div>
                <div className="flex items-center gap-x-6">
                    <WishlistOrCartLink className="hidden lg:inline-block" to={`/profile/${session?.user.id}/wishlist`} icon={FiHeart} itemsCount={profile?.liked_products?.length || 0} />
                    <WishlistOrCartLink to="/cart" icon={FiShoppingBag} itemsCount={order?.order_items?.length || 0} />

                    {!session ? (
                        <Link className="hidden lg:flex items-center gap-x-2 text-white bg-yellow-ochre hover:bg-yellow-ochre-2 transition-all py-2 px-4 rounded-full font-semibold flex-shrink-0" to="/auth">
                            <FiLogIn className="w-5 h-5" />
                            <span className="text-sm">Log in</span>
                        </Link>
                    ) : (
                        <Link className="hidden lg:inline-block rounded-full border border-gray-200 overflow-hidden" to={`/profile/${session.user.id}`}>

                            {profile?.avatar_url ? (
                                <img className="w-8 h-8 object-cover" src={profile.avatar_url} alt={profile.full_name as string} />
                            ) : (
                                <span className="w-8 h-8 font-semibold text-sm aspect-square flex justify-center items-center text-gray-700 bg-gray-100">{profile?.full_name?.slice(0, 2).toUpperCase()}</span>
                            )}

                        </Link>
                    )}

                    <IconButton className="lg:hidden" icon={FiMenu} onClick={() => setIsSidebarOpen(true)} />
                </div>
            </div>
            <nav className="px-10 bg-charcoal hidden lg:block">

                {routes.map((route, index) => (
                    <NavbarLink key={index} to={route.to} label={route.label} end={route.end} />
                ))}

            </nav>
            <div className="pb-6 px-10 lg:hidden">
                <Searchbar />
            </div>
            <div className="h-2 bg-charcoal lg:hidden"></div>
        </header >
    )
}

export default Navbar