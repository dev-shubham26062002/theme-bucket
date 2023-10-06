import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import cn from '@/utils/cn'

interface SelectProps {
    className?: string,
    id: string,
    label: string,
    disabled?: boolean,
    register: UseFormRegister<FieldValues>,
    defaultValue?: string,
    optionsData: { value: string, label: string }[],
    errors?: FieldErrors,
}

const Select: React.FC<SelectProps> = ({
    className,
    id,
    label,
    disabled = false,
    register,
    defaultValue = '',
    optionsData,
    errors,
}) => {
    return (
        <div className={cn('flex flex-col gap-y-2', className)}>
            <label className="text-sm text-charcoal font-medium" htmlFor={id}>{label}</label>
            <select className="appearance-none focus:outline-none focus-visible:outline-none py-2 px-4 rounded-md border border-gray-200 text-sm focus:ring-2 ring-yellow-ochre text-gray-700" disabled={disabled} defaultValue={defaultValue} {...register(id)}>
                <option className="text-sm" value="">Select an option</option>

                {optionsData.map((option, index) => (
                    <option className="text-sm" key={index} value={option.value}>{option.label}</option>
                ))}

            </select>

            {errors && errors[id] && (
                <span className="text-sm text-red-700">{errors[id]?.message as string}</span>
            )}

        </div>
    )
}

export default Select