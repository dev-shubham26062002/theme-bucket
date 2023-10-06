import { IoMdClose } from 'react-icons/io'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm, FieldValues } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiImage } from 'react-icons/fi'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import IconButton from '@/components/general/IconButton'
import { avatarSchema } from '@/utils/formSchema'
import FileInput from '@/components/add-or-edit-product-page/FileInput'
import Button from '../general/Button'

interface EditAvatarModalProps {
    setIsEditAvatarModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    profile: Database['public']['Tables']['profiles']['Row'] | null,
}

const EditAvatarModal: React.FC<EditAvatarModalProps> = ({
    setIsEditAvatarModalOpen,
    profile,
}) => {
    const { handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<z.infer<typeof avatarSchema> | FieldValues>({
        resolver: zodResolver(avatarSchema),
        defaultValues: {
            avatarUrl: profile?.avatar_url || '',
        },
    })

    const navigate = useNavigate()

    const location = useLocation()

    const handleRemoveButtonClick = async () => {
        try {
            const { error: profileError } = await supabase.from('profiles').update({ avatar_url: null }).eq('id', profile?.id as string)

            if (profileError) {
                toast.error('Something went wrong, please try again later.')
                return
            }

            toast.success('Avatar removed successfully.')

            navigate(location.pathname)

            setValue('avatarUrl', '')
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    const handleSubmitButtonClick = async (values: z.infer<typeof avatarSchema> | FieldValues) => {
        try {
            const { error: profileError } = await supabase.from('profiles').update({ avatar_url: values.avatarUrl }).eq('id', profile?.id as string)

            if (profileError) {
                toast.error('Something went wrong, please try again later.')
                return
            }

            toast.success('Avatar updated successfully.')

            navigate(location.pathname)

            setIsEditAvatarModalOpen(false)
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    return (
        <div className="fixed z-40 inset-0 flex justify-center items-center px-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-white rounded-md border border-gray-200 shadow-lg shadow-gray-200 relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => setIsEditAvatarModalOpen(false)} icon={IoMdClose} />
                <h1 className="text-2xl font-semibold text-brown text-center">Edit Your Avatar</h1>
                <p className="mt-6 text-sm text-charcoal font-medium text-center">Customize your avatar image here. You can also remove it from here.</p>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleSubmitButtonClick)}>
                    <FileInput
                        title="Upload Avatar Image"
                        description="Upload single JPEG, JPG, or PNG file. Other formats are not supported."
                        acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                        bucketName="avatars"
                        onSuccessfullUploadCallback={(url: string) => setValue('avatarUrl', url)}
                        id="avatarUrl"
                        label="Avatar URL"
                        note="For better result, upload high resolution image."
                        defaultValue={watch('avatarUrl')}
                        disabled={isSubmitting}
                        icon={FiImage}
                        buttonLabel="Upload Image"
                        setValue={setValue}
                        errors={errors}
                    />
                    <div className="flex items-center gap-x-2">

                        {profile?.avatar_url && (
                            <Button className="flex-1 bg-white border border-yellow-ochre text-yellow-ochre hover:bg-yellow-ochre/10" label="Remove" disabled={isSubmitting} type="button" onClick={handleRemoveButtonClick} />
                        )}

                        <Button className="flex-1" label="Save Changes" type="submit" disabled={isSubmitting} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditAvatarModal