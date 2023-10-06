import cn from '@/utils/cn'

interface HeadingProps {
    className?: string,
    title: string,
}

const Heading: React.FC<HeadingProps> = ({
    className,
    title,
}) => {
    return (
        <div className={cn('flex items-center gap-x-2 font-semibold uppercase text-white', className)}>
            <h1 className="py-2 px-4 bg-charcoal">{title}</h1>
            <div className="h-px flex-1 bg-gray-200"></div>
        </div>
    )
}

export default Heading