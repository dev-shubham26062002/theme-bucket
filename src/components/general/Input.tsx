import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import cn from '@/utils/cn'

interface InputProps {
    className?: string,
    id: string,
    label: string,
    type?: 'text' | 'password',
    disabled?: boolean,
    register: UseFormRegister<FieldValues>,
    errors?: FieldErrors,
}
const Input: React.FC<InputProps> = ({
    className,
    id,
    label,
    type = 'text',
    disabled = false,
    register,
    errors,
}) => {
    return (
        <div className={cn('flex flex-col gap-y-2', className)}>
            <label className="text-sm text-charcoal font-medium" htmlFor={id}>{label}</label>
            <input className="focus:outline-none focus-visible:outline-none py-2 px-4 rounded-md text-sm border border-gray-200 focus:ring-2 ring-yellow-ochre text-gray-700" id={id} type={type} disabled={disabled} {...register(id)} />

            {errors && errors[id] && (
                <span className="text-sm text-red-700">{errors[id]?.message as string}</span>
            )}

        </div>
    )
}

export default Input