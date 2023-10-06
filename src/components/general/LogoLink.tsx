import { Link } from 'react-router-dom'

import cn from '@/utils/cn'

interface LogoLinkProps {
    className?: string,
    to: string,
    variant?: 'default' | 'colorful',
}

const LogoLink: React.FC<LogoLinkProps> = ({
    className,
    to,
    variant = 'default',
}) => {
    return (
        <Link className={cn('inline-block text-3xl font-bold text-yellow-ochre tracking-tighter', className)} to={to}>
            <h1 className="font-space-grotesk">Theme<span className={cn('text-3xl font-space-grotesk', variant === 'colorful' && 'text-brown')}>Bucket</span>.</h1>
        </Link>
    )
}

export default LogoLink