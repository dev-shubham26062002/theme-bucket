import { Link } from 'react-router-dom'

import cn from '@/utils/cn'

interface TopCategoryCardProps {
    className?: string
    to: string,
    imageSrc: string,
    name: string,
}

const TopCategoryCard: React.FC<TopCategoryCardProps> = ({
    className,
    to,
    imageSrc,
    name,
}) => {
    return (
        <Link className={cn('w-full relative group hover:-translate-y-1 transition-all transform-gpu rounded-md border border-gray-200 shadow-lg shadow-gray-200 overflow-hidden hover:shadow-md', className)} to={to}>
            <img className="aspect-video w-full object-cover bg-white" src={imageSrc} alt={name} />
            <div className="absolute inset-0 group-hover:bg-black/40"></div>
            <h1 className="absolute left-0 bottom-0 right-0 p-4 bg-black/60 text-white font-semibold translate-y-full group-hover:translate-y-0 transform-gpu transition-all truncate text-lg">{name}</h1>
        </Link>
    )
}

export default TopCategoryCard