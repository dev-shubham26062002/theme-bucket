import { useLoaderData } from 'react-router-dom'
import { FiEdit } from 'react-icons/fi'
import { useState } from 'react'

import supabase from '@/libs/supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Database } from '@/utils/supabaseTypes'
import Heading from '@/components/general/Heading'
import EditAvatarModal from '@/components/profile-page/EditAvatarModal'
import EditProfileModal from '@/components/profile-page/EditProfileModal'
import Button from '@/components/general/Button'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'

export const profilePageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: profileData } = await supabase.from('profiles').select('*, cities(*), countries(*)').eq('id', sessionData.session?.user.id as string).single()

        const { data: countriesData } = await supabase.from('countries').select('*').order('name', { ascending: true })

        const { data: citiesData } = await supabase.from('cities').select('*').order('name', { ascending: true })

        return [sessionData.session, profileData, countriesData, citiesData]
    } catch (error) {
        throw new Error('ERROR_AT_PROFILE_PAGE_LOADER' + error)
    }
}

const ProfilePage = () => {
    const [session, profile, countries, cities] = useLoaderData() as [Session, (Database['public']['Tables']['profiles']['Row'] & { countries: Database['public']['Tables']['countries']['Row'] | null, cities: Database['public']['Tables']['cities']['Row'] | null }) | null, Database['public']['Tables']['countries']['Row'][] | null, Database['public']['Tables']['cities']['Row'][] | null]

    const [isEditAvatarModalOpen, setIsEditAvatarModalOpen] = useState(false)

    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

    return (
        <>
            {isEditAvatarModalOpen && (
                <EditAvatarModal setIsEditAvatarModalOpen={setIsEditAvatarModalOpen} profile={profile} />
            )}

            {isEditProfileModalOpen && (
                <EditProfileModal setIsEditProfileModalOpen={setIsEditProfileModalOpen} profile={profile} countries={countries} cities={cities} />
            )}

            <div className="p-10">
                <h1 className="text-2xl text-gray-700 text-center">My&nbsp;<span className="text-2xl font-semibold uppercase">Profile</span></h1>
                <div className="pt-10">
                    <div className="space-y-6">
                        <Heading title="Personal Information" />
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col justify-center items-center gap-y-6">

                                {profile?.avatar_url ? (
                                    <img className="w-40 h-40 border border-gray-200 bg-white object-cover rounded-full" src={profile.avatar_url} alt={profile.full_name as string} />
                                ) : (
                                    <span className="w-40 h-40 rounded-full text-6xl text-gray-700 font-semibold flex justify-center items-center border border-gray-200 bg-gray-100">{profile?.full_name?.slice(0, 2).toUpperCase()}</span>
                                )}

                                <button className="flex items-center gap-x-1 text-gray-700 font-medium hover:text-yellow-ochre transition-all" onClick={() => setIsEditAvatarModalOpen(true)}>
                                    <FiEdit className="w-5 h-4" />
                                    <span className="text-sm">Edit</span>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col gap-y-6">
                                <div className="flex flex-col gap-y-2">
                                    <span className="text-sm font-medium text-charcoal">Name</span>
                                    <span className="text-sm py-2 px-4 rounded border border-gray-200 bg-gray-100 text-gray-700">{profile?.full_name}</span>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <span className="text-sm font-medium text-charcoal">Email</span>
                                    <span className="text-sm py-2 px-4 rounded border border-gray-200 bg-gray-100 text-gray-700">{profile?.email}</span>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <span className="text-sm font-medium text-charcoal">Role</span>
                                    <span className="text-sm py-2 px-4 rounded border border-gray-200 bg-gray-100 text-gray-700">{profile?.role}</span>
                                </div>
                            </div>
                        </div>
                        <Heading title="Located At" />
                        <div className="flex flex-col gap-y-2">
                            <span className="text-sm font-medium text-charcoal">Location</span>
                            <span className="text-sm py-2 px-4 rounded border border-gray-200 bg-gray-100 text-gray-700">{profile?.cities?.name}, {profile?.countries?.name}</span>
                        </div>
                        <Heading title="Linked Accounts" />
                        <div className="flex-1 flex flex-col md:flex-row gap-6">

                            {session.user.app_metadata.providers.includes('google') && (
                                <div className="flex-1 flex items-center gap-x-2 py-2 px-4 rounded border border-gray-200 bg-gray-100">
                                    <FcGoogle className="w-8 h-8" />
                                    <span className="text-sm font-medium text-gray-700">Google</span>
                                </div>
                            )}

                            {session.user.app_metadata.providers.includes('github') && (
                                <div className="flex-1 flex items-center gap-x-2 py-2 px-4 rounded border border-gray-200 bg-gray-100">
                                    <BsGithub className="w-8 h-8" />
                                    <span className="text-sm font-medium text-gray-700">GitHub</span>
                                </div>
                            )}


                        </div>
                        <Button label="Edit" onClick={() => setIsEditProfileModalOpen(true)} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage