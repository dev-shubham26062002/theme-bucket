import { Link, redirect, useNavigate } from 'react-router-dom'
import { IoMdClose } from 'react-icons/io'
import { useState } from 'react'
import toast from 'react-hot-toast'

import supabase from '@/libs/supabaseClient'
import LogoLink from '@/components/general/LogoLink'
import SocialAuthButton from '@/components/auth-page/SocialAuthButton'
import IconButton from '@/components/general/IconButton'

export const authPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData.session) {
            return redirect(`/profile/${sessionData.session.user.id}`)
        }

        return null
    } catch (error) {
        throw new Error('ERROR_AT_AUTH_PAGE_LOADER' + error)
    }
}

const AuthPage = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSocialAuthButtonClick = async (provider: 'google' | 'github') => {
        try {
            setIsLoading(true)

            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            })

            // Pretty sure that this will never be executed but still...
            if (authError) {
                toast.error('Something break while authentication process, please try again later.')
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="h-full flex justify-center items-center mx-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-charcoal rounded-lg border border-gray-200 shadow-lg shadow-gray-200 text-center relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" disabled={isLoading} onClick={() => navigate(-1)} icon={IoMdClose} />
                <LogoLink to="/auth" />
                <p className="text-gray-200 text-center mt-1">Login or create an account.</p>
                <div className="mt-6">
                    <SocialAuthButton disabled={isLoading} onClick={() => handleSocialAuthButtonClick('google')} provider="google" />
                    <SocialAuthButton className="mt-2" disabled={isLoading} onClick={() => handleSocialAuthButtonClick('github')} provider="github" />
                </div>
                <div className="h-px bg-gray-200 my-6"></div>
                <p className="text-gray-200">Account creation signifies agreement to
                    our<br /><Link className="hover:underline cursor-pointer text-yellow-ochre transition-all" to="#" target="_blank">Terms & Conditions.</Link></p>
            </div>
        </main>
    )
}

export default AuthPage