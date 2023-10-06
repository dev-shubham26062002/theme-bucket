import { NavLink } from 'react-router-dom'

import cn from '@/utils/cn'

interface NavbarLinkProps {
    className?: string,
    to: string,
    label: string,
    end?: boolean,
    onClick?: () => void,
}

const NavbarLink: React.FC<NavbarLinkProps> = ({
    className,
    to,
    label,
    end,
    onClick,
}) => {
    return (
        <NavLink className={cn('py-2 px-4 text-white font-semibold bg-charcoal inline-block text-sm uppercase hover:bg-yellow-ochre hover:text-charcoal transition-all', className)} to={to} end={end} onClick={onClick}>{label}</NavLink>
    )
}

export default NavbarLink