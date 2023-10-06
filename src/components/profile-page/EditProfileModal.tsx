import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { IoMdClose } from 'react-icons/io'
import { useState, useEffect } from 'react'

import { Database } from '@/utils/supabaseTypes'
import supabase from '@/libs/supabaseClient'
import IconButton from '@/components/general/IconButton'
import { profileSchema } from '@/utils/formSchema'
import Input from '@/components/general/Input'
import Select from '@/components/general/Select'
import Button from '@/components/general/Button'
import { useLocation, useNavigate } from 'react-router-dom'

interface EditProfileModalProps {
    setIsEditProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    profile: Database['public']['Tables']['profiles']['Row'] | null,
    countries: Database['public']['Tables']['countries']['Row'][] | null,
    cities: Database['public']['Tables']['cities']['Row'][] | null,
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    setIsEditProfileModalOpen,
    profile,
    countries,
    cities,
}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<z.infer<typeof profileSchema> | FieldValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile?.full_name || '',
            country: profile?.country_id || '',
            city: profile?.city_id || '',
        },
    })

    const navigate = useNavigate()

    const location = useLocation()

    const handleSubmitButtonClick = async (values: z.infer<typeof profileSchema> | FieldValues) => {
        try {
            const { error: profileError } = await supabase.from('profiles').update({
                full_name: values.name,
                country_id: values.country === '' ? null : values.country,
                city_id: values.city === '' ? null : values.city,
            }).eq('id', profile?.id as string)

            if (profileError) {
                toast.error('Something went wrong, please try again later.')
                return
            }

            toast.success('Profile successfully updated.')

            navigate(location.pathname)

            setIsEditProfileModalOpen(false)
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    const [citiesData, setCitiesData] = useState<Database['public']['Tables']['cities']['Row'][]>(cities || [])

    useEffect(() => {
        const getAndSetCitiesData = async () => {
            if (watch('country') === '') {
                setCitiesData(cities || [])
            } else {
                const { data: citiesData } = await supabase.from('cities').select('*').eq('country_id', watch('country')).order('name', { ascending: true })

                setCitiesData(citiesData || [])
            }
        }

        getAndSetCitiesData()
    }, [watch('country')])

    return (
        <div className="fixed z-40 inset-0 flex justify-center items-center px-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-white rounded-md border border-gray-200 shadow-lg shadow-gray-200 relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => setIsEditProfileModalOpen(false)} icon={IoMdClose} />
                <h1 className="text-2xl font-semibold text-brown text-center">Edit Your Profile</h1>
                <p className="mt-6 text-sm text-charcoal font-medium text-center">Edit and customize your profile details here.</p>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleSubmitButtonClick)}>
                    <Input label="Name" disabled={isSubmitting} register={register} errors={errors} id="name" />
                    <Select label="Country" disabled={isSubmitting} register={register} errors={errors} id="country" optionsData={countries ? countries.map((country) => ({ value: country.id, label: country.name })) : []} defaultValue={watch('country')} />
                    <Select label="City" disabled={isSubmitting} register={register} errors={errors} id="city" optionsData={citiesData.map((city) => ({ value: city.id, label: city.name }))} defaultValue={watch('city')} />
                    <Button label="Save Changes" disabled={isSubmitting} type="submit" />
                </form>
            </div>
        </div>
    )
}

export default EditProfileModal