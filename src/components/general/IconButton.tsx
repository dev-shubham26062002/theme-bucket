import { IconType } from 'react-icons'

import cn from '@/utils/cn'

interface IconButtonProps {
    className?: string,
    type?: 'button' | 'submit'
    disabled?: boolean,
    onClick?: () => void,
    icon: IconType,
}

const IconButton: React.FC<IconButtonProps> = ({
    className,
    type = 'button',
    disabled = false,
    onClick,
    icon: Icon,
}) => {
    return (
        <button className={cn('p-2 rounded-full text-white bg-yellow-ochre hover:bg-yellow-ochre-2 transition-all', className)} type={type} disabled={disabled} onClick={onClick}>
            <Icon className="w-5 h-5" />
        </button>
    )
}

export default IconButton