import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { FieldErrors } from 'react-hook-form'

import cn from '@/utils/cn'

interface RichTextEditorProps {
    className?: string,
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    errors?: FieldErrors,
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    className,
    id,
    label,
    value,
    onChange,
    errors,
}) => {
    return (
        <div className={cn('flex flex-col gap-y-2', className)}>
            <label className="text-sm text-charcoal font-medium" htmlFor={id}>{label}</label>
            <ReactQuill value={value} onChange={onChange}
                modules={{
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link'],
                    ],
                }}
            />

            {errors && errors[id] && (
                <span className="text-sm text-red-700">{errors[id]?.message as string}</span>
            )}

        </div>
    )
}

export default RichTextEditor