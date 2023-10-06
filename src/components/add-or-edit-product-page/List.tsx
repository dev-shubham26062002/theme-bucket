import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { useRef } from 'react'
import { FieldValues, UseFormSetValue, FieldErrors } from 'react-hook-form'

import IconButton from '@/components/general/IconButton'
import cn from '@/utils/cn'

interface ListProps {
    className?: string,
    id: string,
    label: string,
    disabled?: boolean,
    setValue: UseFormSetValue<FieldValues>,
    defaultValue?: string[],
    errors?: FieldErrors,
}

const List: React.FC<ListProps> = ({
    className,
    id,
    label,
    disabled = false,
    setValue,
    defaultValue = [],
    errors,
}) => {
    const ref = useRef<HTMLInputElement>(null)

    const handleAddButtonClick = () => {
        if (ref.current?.value.trim() === '' || defaultValue.includes(ref.current?.value.trim() as string)) {
            ref.current?.focus()
            return null
        }

        setValue(id, [...defaultValue, ref.current?.value.trim()])
    }

    const handleRemoveButtonClick = (item: string) => {
        setValue(id, defaultValue.filter((value) => value !== item))
    }

    return (
        <div className={cn('flex flex-col gap-y-2', className)}>
            <label className="text-sm text-charcoal font-medium" htmlFor={id}>{label}</label>
            <div className="flex items-center gap-x-2">
                <input className="focus:outline-none focus-visible:outline-none py-2 px-4 rounded-md text-sm border border-gray-200 focus:ring-2 ring-yellow-ochre flex-1 text-gray-700" id="item" disabled={disabled} ref={ref} />
                <IconButton type="button" disabled={disabled} onClick={handleAddButtonClick} icon={IoMdAdd} />
            </div>
            <div className="flex gap-2 flex-wrap">

                {defaultValue.map((value, index) => (
                    <div key={index} className="inline-flex items-center gap-x-2 py-2 px-4 font-medium text-gray-700 rounded-full border border-gray-200 bg-gray-100">
                        <span className="text-sm">{value}</span>
                        <button type="button" disabled={disabled} onClick={() => handleRemoveButtonClick(value)}>
                            <IoMdClose className="w-5 h-5" />
                        </button>
                    </div>
                ))}

            </div>

            {errors && errors[id] && (
                <span className="text-sm text-red-700">{errors[id]?.message as string}</span>
            )}

        </div>
    )
}

export default List