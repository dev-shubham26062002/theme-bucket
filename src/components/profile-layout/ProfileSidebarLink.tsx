import { IconType } from 'react-icons'
import { NavLink } from 'react-router-dom'

import cn from '@/utils/cn'

interface ProfileSidebarLinkProps {
    hidden?: boolean,
    className?: string,
    to: string,
    end?: boolean,
    icon: IconType,
    label: string,
}

const ProfileSidebarLink: React.FC<ProfileSidebarLinkProps> = ({
    hidden,
    className,
    to,
    end = false,
    icon: Icon,
    label,
}) => {
    return (
        <NavLink className={cn('flex justify-center items-center gap-x-2 py-2 px-4 rounded border border-gray-200 text-gray-700 hover:text-white hover:bg-charcoal transition-all font-medium', hidden && 'hidden', className)} to={to} end={end}>
            <Icon className="w-5 h-5" />
            <span className="flex-1 text-sm hidden lg:inline-block">{label}</span>
        </NavLink>
    )
}

export default ProfileSidebarLink