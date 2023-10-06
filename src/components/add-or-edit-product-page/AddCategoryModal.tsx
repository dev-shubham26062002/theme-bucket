import { IoMdClose } from 'react-icons/io'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FiImage } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { Session } from '@supabase/supabase-js'

import supabase from '@/libs/supabaseClient'
import IconButton from '@/components/general/IconButton'
import Input from '@/components/general/Input'
import FileInput from '@/components/add-or-edit-product-page/FileInput'
import { addCategorySchema } from '@/utils/formSchema'
import Button from '@/components/general/Button'

interface AddCategoryModalProps {
    setIsAddCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    session: Session,
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    setIsAddCategoryModalOpen,
    session,
}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<z.infer<typeof addCategorySchema> | FieldValues>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        },
    })

    const handleSubmitButtonClick = async (values: z.infer<typeof addCategorySchema> | FieldValues) => {
        try {
            const { error: categoryError } = await supabase.from('categories').insert({
                name: values.name,
                image_url: values.imageUrl,
                user_id: session.user.id,
            })

            if (categoryError) {
                toast.error('Category with this name already exists, please try again with different name.')
            } else {
                toast.success('Category added successfully. Please wait while we reload the page.')

                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    return (
        <div className="fixed z-40 inset-0 flex justify-center items-center px-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-white rounded-md border border-gray-200 shadow-lg shadow-gray-200 relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => setIsAddCategoryModalOpen(false)} icon={IoMdClose} />
                <h1 className="text-2xl font-semibold text-brown text-center">Add New Category</h1>
                <p className="mt-6 text-sm text-charcoal font-medium text-center">Once you add a category, you can't edit or delete it.</p>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleSubmitButtonClick)}>
                    <Input id="name" label="Name" disabled={isSubmitting} register={register} errors={errors} />
                    <FileInput
                        title="Upload Category Image"
                        description="Upload single JPEG, JPG, or PNG file. Other formats are not supported."
                        acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                        bucketName="categories_images"
                        onSuccessfullUploadCallback={(url: string) => setValue('imageUrl', url)}
                        id="imageUrl"
                        label="Image URL"
                        note="For better result, upload high resolution image."
                        defaultValue={watch('imageUrl')}
                        disabled={isSubmitting}
                        icon={FiImage}
                        buttonLabel="Upload Image"
                        setValue={setValue}
                        errors={errors}
                    />
                    <Button type="submit" disabled={isSubmitting} label="Continue" />
                </form>
            </div>
        </div>
    )
}

export default AddCategoryModal