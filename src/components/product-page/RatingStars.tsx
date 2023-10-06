import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'

import cn from '@/utils/cn'

interface RatingStarsProps {
    className?: string,
    rating: number,
}

const RatingStars: React.FC<RatingStarsProps> = ({
    className,
    rating,
}) => {
    return (
        <div className={cn('flex gap-x-0.5', className)}>
            {Array(Math.floor(rating)).fill(0).map((_, index) => (
                <BsStarFill key={index} className="w-5 h-5 text-yellow-ochre" />
            ))}
            {rating % 1 > 0 && <BsStarHalf className="w-5 h-5 text-yellow-ochre" />}
            {Array(5 - Math.ceil(rating)).fill(0).map((_, index) => (
                <BsStar key={index} className="w-5 h-5 text-yellow-ochre" />
            ))}
        </div>
    )
}

export default RatingStars