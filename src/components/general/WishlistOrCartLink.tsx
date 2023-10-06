import { Link } from 'react-router-dom'
import { IconType } from 'react-icons'

import cn from '@/utils/cn'

interface WishlistOrCartLinkProps {
    className?: string,
    to: string,
    icon: IconType,
    itemsCount: number,
}

const WishlistOrCartLink: React.FC<WishlistOrCartLinkProps> = ({
    className,
    to,
    icon: Icon,
    itemsCount,
}) => {
    return (
        <Link className={cn('relative', className)} to={to}>
            <Icon className="w-5 h-5" />
            <span className="absolute bg-gray-700 w-2.5 h-2.5 top-0 right-0 translate-x-1/3 -translate-y-1/3 text-[0.5rem] flex justify-center items-center rounded-full font-semibold text-white">{itemsCount}</span>
        </Link>
    )
}

export default WishlistOrCartLink