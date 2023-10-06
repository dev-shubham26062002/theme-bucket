import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'

import cn from '@/utils/cn'

interface SocialAuthButtonProps {
    className?: string,
    disabled?: boolean,
    onClick?: () => void,
    provider: 'google' | 'github',
}

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
    className,
    disabled = false,
    onClick,
    provider,
}) => {
    return (
        <button className={cn('flex items-center gap-x-1 w-full rounded-full border border-gray-200 p-2 bg-white hover:bg-gray-100 transition-all font-semibold text-charcoal', className)} disabled={disabled} onClick={onClick}>

            {provider === 'google' ? (
                <FcGoogle className="w-5 h-5" />
            ) : (
                <BsGithub className="w-5 h-5" />
            )}

            <span className="flex-1 text-sm">Continue with {provider === 'google' ? 'Google' : 'GitHub'}</span>
        </button>
    )
}

export default SocialAuthButton