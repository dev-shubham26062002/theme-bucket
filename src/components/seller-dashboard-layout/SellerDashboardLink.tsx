import { NavLink } from 'react-router-dom'

import cn from '@/utils/cn'

interface SellerDashboardLinkProps {
    className?: string,
    to: string,
    end?: boolean,
    label: string,
}

const SellerDashboardLink: React.FC<SellerDashboardLinkProps> = ({
    className,
    to,
    end = false,
    label,
}) => {
    return (
        <NavLink className={cn('py-2 px-4 font-medium text-yellow-ochre text-sm rounded-md border border-yellow-ochre hover:bg-yellow-ochre/10 transition-all', className)} to={to} end={end}>{label}</NavLink>
    )
}

export default SellerDashboardLink