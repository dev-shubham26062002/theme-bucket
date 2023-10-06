import cn from '@/utils/cn'

interface ButtonProps {
    className?: string,
    type?: 'button' | 'submit',
    disabled?: boolean,
    onClick?: () => void,
    label: string,
}

const Button: React.FC<ButtonProps> = ({
    className,
    type = 'button',
    disabled = false,
    onClick,
    label,
}) => {
    return (
        <button className={cn('py-2 px-4 font-semibold rounded-md bg-yellow-ochre hover:bg-yellow-ochre-2 transition-all text-white text-sm', className)} type={type} disabled={disabled} onClick={onClick}>{label}</button>
    )
}

export default Button