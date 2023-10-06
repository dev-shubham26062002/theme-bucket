import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form'

import cn from '@/utils/cn'

interface CheckboxProps {
    className?: string,
    id: string,
    disabled?: boolean,
    register: UseFormRegister<FieldValues>,
    label: React.ReactNode,
    errors?: FieldErrors,
}

const Checkbox: React.FC<CheckboxProps> = ({
    className,
    id,
    disabled = false,
    register,
    label,
    errors,
}) => {
    return (
        <div className={cn('flex flex-col gap-y-2', className)}>
            <div className="flex items-center gap-x-2">
                <input className="focus-visible:outline-none focus:ring-2 ring-yellow-ochre ring-offset-2" id={id} type="checkbox" disabled={disabled} {...register(id)} />
                <label className="text-sm text-charcoal font-medium" htmlFor={id}>{label}</label>
            </div>

            {errors && errors[id] && (
                <span className="text-sm text-red-700">{errors[id]?.message as string}</span>
            )}

        </div>
    )
}

export default Checkbox