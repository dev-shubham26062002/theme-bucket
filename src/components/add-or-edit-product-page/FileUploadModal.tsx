import { IoMdClose } from 'react-icons/io'
import { useDropzone } from 'react-dropzone'
import { FiFile } from 'react-icons/fi'
import toast from 'react-hot-toast'
import uniqid from 'uniqid'

import supabase from '@/libs/supabaseClient'
import cn from '@/utils/cn'
import useFileUploadModal from '@/hooks/useFileUploadModal'
import IconButton from '@/components/general/IconButton'

const FileUploadModal = () => {
    const { isOpen, setIsOpen, title, description, acceptedTypes, file, setFile, error, setError, isUploading, setIsUploading, bucketName, onSuccessfullUploadCallback } = useFileUploadModal()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (files: File[]) => {
            if (files.length === 0) {
                setError('File cannot be empty.')
                return null
            }

            if (!acceptedTypes.includes(files[0].type)) {
                setError('File type not accepted.')
                return null
            }

            setError(null)
            setFile(files[0])
        },
        maxFiles: 1,
        multiple: false,
    })

    const handleUploadButtonClick = async () => {
        try {
            setIsUploading(true)

            const fileName = `${uniqid()}-${uniqid()}.${file?.name?.split('.').pop()}`

            const { data: uploadData, error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file as File)

            // Pretty sure that this will never be executed but still...
            if (uploadError) {
                toast.error('Something went wrong, please try again later.')
            } else {
                toast.success('File uploaded successfully.')
                onSuccessfullUploadCallback(`${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/object/public/${bucketName}/${uploadData.path}`)
                setIsOpen(false)
                setFile(null)
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleCloseButtonClick = () => {
        setIsOpen(false)
        setFile(null)
    }

    if (!isOpen) {
        return null
    }

    return (
        <div className="fixed z-50 inset-0 flex justify-center items-center px-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-white rounded-md border border-gray-200 shadow-lg shadow-gray-200 relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" disabled={isUploading} onClick={handleCloseButtonClick} icon={IoMdClose} />
                <h1 className="text-2xl font-semibold text-brown text-center">{title}</h1>
                <p className="mt-6 text-sm text-charcoal font-medium text-center">{description}</p>
                <div className="mt-6 flex flex-col gap-y-2">

                    {file ? (
                        <div className="p-10 border border-gray-200 rounded-md flex flex-col justify-center items-center text-gray-700">
                            <FiFile className="w-10 h-10" />
                            <div className="mt-6 flex gap-x-2">
                                <button className="py-2 px-4 rounded-md border border-gray-700 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-all" disabled={isUploading} onClick={() => setFile(null)}>Remove</button>
                                <button className="py-2 px-4 rounded-md bg-gray-700 text-white text-sm font-semibold hover:bg-gray-800 transition-all" disabled={isUploading} onClick={handleUploadButtonClick}>Upload</button>
                            </div>
                        </div>
                    ) : (
                        <div className={cn('p-10 border border-dashed border-gray-200 rounded-md cursor-pointer', isDragActive && 'border-solid ring-2 ring-yellow-ochre')} {...getRootProps()}>
                            <input disabled={isUploading} {...getInputProps()} />
                            <p className="text-center text-sm text-gray-400">Drag and drop your file here or,<br />click here to upload</p>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-700">{error}</p>
                    )}

                </div>
            </div>
        </div >
    )
}

export default FileUploadModal