import { NavLink } from 'react-router-dom'

import cn from '@/utils/cn'

interface CategoryLinkProps {
    className?: string,
    to: string,
    label: string,
    end?: boolean,
}

const CategoryLink: React.FC<CategoryLinkProps> = ({
    className,
    to,
    label,
    end = false,
}) => {
    return (
        <NavLink className={cn('py-2 px-4 h-fit rounded-md hover:bg-gray-100 transition-all border border-gray-200 text-gray-700 text-sm font-medium', className)} to={to} end={end}>{label}</NavLink>
    )
}

export default CategoryLink