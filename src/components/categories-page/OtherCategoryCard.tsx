import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

import cn from '@/utils/cn'

interface OtherCategoryCardProps {
    className?: string
    to: string,
    imageSrc: string,
    name: string,
}

const OtherCategoryCard: React.FC<OtherCategoryCardProps> = ({
    className,
    to,
    imageSrc,
    name,
}) => {
    return (
        <Link className={cn('w-full group rounded-md border border-gray-200 shadow shadow-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all transform-gpu', className)} to={to}>
            <img className="border-b border-gray-200 w-full aspect-video object-cover bg-white" src={imageSrc} alt={name} />
            <div className="p-4 text-gray-700 flex items-center gap-x-2">
                <h1 className="text-gray-700 font-semibold truncate flex-1 text-lg">{name}</h1>
                <FiChevronRight className="w-5 h-5" />
            </div>
        </Link>
    )
}

export default OtherCategoryCard