import { redirect, useLoaderData, Link } from 'react-router-dom'
import { AiOutlineWarning } from 'react-icons/ai'
import { useForm, FieldValues } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Session } from '@supabase/supabase-js'

import { Database } from '@/utils/supabaseTypes'
import supabase from '@/libs/supabaseClient'
import { becomeASellerSchema } from '@/utils/formSchema'
import Checkbox from '@/components/general/Checkbox'
import Button from '@/components/general/Button'

export const becomeASellerPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', sessionData.session?.user.id as string).single()

        if (profileData?.role === 'SELLER') {
            return redirect(`/profile/${sessionData.session?.user.id}/seller-dashboard`)
        }

        return [sessionData.session, profileData]
    } catch (error) {
        throw new Error('ERROR_AT_BECOME_A_SELLER_PAGE_LOADER' + error)
    }
}

const BecomeASellerPage = () => {
    const [session] = useLoaderData() as [Session, Database['public']['Tables']['profiles']['Row']]

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<z.infer<typeof becomeASellerSchema> | FieldValues>({
        resolver: zodResolver(becomeASellerSchema),
        defaultValues: {
            termsAndConditions: false,
        },
    })

    const handleSubmitButtonClick = async () => {
        try {
            const { error: profileError } = await supabase.from('profiles').update({
                role: 'SELLER',
            }).eq('id', session.user.id)

            if (profileError) {
                toast.error('Something break while updating your role, please try again later.')
            } else {
                toast.success('You are now a seller, please wait while we redirect you to your dashboard.')

                setTimeout(() => {
                    window.location.assign(`/profile/${session.user.id}/seller-dashboard`)
                }, 3000)
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    return (
        <>
            <div className="py-2 px-4 flex items-center gap-x-2 bg-gray-100 border border-gray-200 text-gray-700">
                <AiOutlineWarning className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Once you're role is set to seller, you can't revert it back to buyer.</span>
            </div>
            <div className="p-10">
                <h1 className="text-2xl text-gray-700 text-center">Become a&nbsp;<span className="text-2xl font-semibold uppercase">Seller</span></h1>
                <form className="mt-10" onSubmit={handleSubmit(handleSubmitButtonClick)}>
                    <div className="flex items-center gap-x-2 font-semibold uppercase text-white">
                        <h1 className="py-2 px-4 bg-charcoal">Join As Seller</h1>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                    <div className="mt-6 space-y-6">
                        <Checkbox id="termsAndConditions" disabled={isSubmitting} register={register} label={
                            <>By checking this you're agreeing to our&nbsp;<Link className="text-sm text-yellow-ochre hover:underline transition-all" to="#" target="_blank">Terms & Conditions.</Link></>
                        } />
                        <Button type="submit" disabled={isSubmitting} label="Continue" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default BecomeASellerPage