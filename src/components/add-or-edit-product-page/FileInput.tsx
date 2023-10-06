import { IconType } from 'react-icons'
import { IoMdClose } from 'react-icons/io'
import { RiFolderZipLine } from 'react-icons/ri'
import { FiFile } from 'react-icons/fi'
import { FieldValues, UseFormSetValue, FieldErrors } from 'react-hook-form'

import useFileUploadModal from '@/hooks/useFileUploadModal'
import cn from '@/utils/cn'
import IconButton from '@/components/general/IconButton'

interface FileInputProps {
    title: string,
    description: string,
    acceptedTypes: string[],
    bucketName: 'products_main_images' | 'products_other_images' | 'products_source_code' | 'categories_images' | 'avatars' | '',
    onSuccessfullUploadCallback: (url: string) => void,
    className?: string,
    id: string,
    label: string,
    note: string,
    defaultValue?: string,
    disabled?: boolean,
    icon: IconType,
    buttonLabel: string,
    setValue: UseFormSetValue<FieldValues>,
    errors?: FieldErrors,
}

const FileInput: React.FC<FileInputProps> = ({
    title,
    description,
    acceptedTypes,
    bucketName,
    onSuccessfullUploadCallback,
    className,
    id,
    label,
    note,
    defaultValue = '',
    disabled = false,
    icon: Icon,
    buttonLabel,
    setValue,
    errors,
}) => {
    const { setIsOpen, setTitle, setDescription, setAcceptedTypes, setBucketName, setOnSuccessfullUploadCallback } = useFileUploadModal()

    const handleUploadButtonClick = () => {
        setIsOpen(true)
        setTitle(title)
        setDescription(description)
        setAcceptedTypes(acceptedTypes)
        setBucketName(bucketName)
        setOnSuccessfullUploadCallback(onSuccessfullUploadCallback)
    }

    return (
        <div className={cn('flex flex-col gap-y-2', className)}>
            <label className="text-sm text-charcoal font-medium" htmlFor={id}>{label}</label>
            <span className="text-sm text-gray-400">{note}</span>

            {defaultValue === '' ? (
                <button className="mt-4 w-fit flex items-center gap-x-2 py-2 px-4 rounded-md border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-all font-medium text-gray-700" type="button" disabled={disabled} onClick={handleUploadButtonClick}>
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{buttonLabel}</span>
                </button>
            ) : (
                <div className="mt-4 w-full max-w-[20rem] relative">

                    {defaultValue.split('.').pop() === 'jpg' || defaultValue.split('.').pop() === 'jpeg' || defaultValue.split('.').pop() === 'png' ? (
                        <img className="w-full max-w-[20rem] aspect-video rounded-md border border-gray-200 object-cover" src={defaultValue} alt="Upload Preview" />
                    ) : defaultValue.split('.').pop() === 'zip' ? (
                        <div className="w-full max-w-[20rem] aspect-video rounded-md border border-gray-200 flex justify-center items-center">
                            <RiFolderZipLine className="w-10 h-10" />
                        </div>
                    ) : (
                        <div className="w-full max-w-[20rem] aspect-video rounded-md border border-gray-200 flex justify-center items-center">
                            <FiFile className="w-10 h-10" />
                        </div>
                    )}

                    <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" type="button" disabled={disabled} onClick={() => setValue(id, '')} icon={IoMdClose} />
                </div>
            )}

            {errors && errors[id] && (
                <span className="text-sm text-red-700">{errors[id]?.message as string}</span>
            )}

        </div >
    )
}

export default FileInput