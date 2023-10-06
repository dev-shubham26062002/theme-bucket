import { Link, useLoaderData } from 'react-router-dom'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import TopCategoryCard from '@/components/categories-page/TopCategoryCard'

export const homePageLoader = async () => {
    try {
        const { data: categoriesData } = await supabase.from('categories').select('*').order('created_at', { ascending: false })

        return categoriesData
    } catch (error) {
        throw new Error('ERROR_AT_HOME_PAGE_LOADER' + error)
    }
}

const HomePage = () => {
    const categories = useLoaderData() as Database['public']['Tables']['categories']['Row'][] | null

    return (
        <div>
            <div className="py-6 bg-gray-100 flex flex-col md:flex-row justify-center items-center gap-10">
                <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
                    <div className="flex items-center gap-x-2">
                        <img className="w-14 h-14 object-cover" src="https://jxguxsydhgtsizezswyy.supabase.co/storage/v1/object/public/assets/react-logo.svg" alt="React Logo" />
                        <span className="text-lg font-medium text-gray-700">React</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <img className="w-14 h-14 object-cover" src="https://jxguxsydhgtsizezswyy.supabase.co/storage/v1/object/public/assets/tailwindcss-logo.svg" alt="TailwindCSS Logo" />
                        <span className="text-lg font-medium text-gray-700">TailwindCSS</span>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
                    <div className="flex items-center gap-x-2">
                        <img className="w-14 h-14 object-cover" src="https://jxguxsydhgtsizezswyy.supabase.co/storage/v1/object/public/assets/supabase-logo.svg" alt="Supabase Logo" />
                        <span className="text-lg font-medium text-gray-700">Supabase</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <img className="w-14 h-14 object-cover" src="https://jxguxsydhgtsizezswyy.supabase.co/storage/v1/object/public/assets/node-js-logo.png" alt="NodeJS Logo" />
                        <span className="text-lg font-medium text-gray-700">NodeJS</span>
                    </div>
                </div>
            </div>

            {categories && categories.length > 0 && (
                <div className="p-10">
                    <h1 className="text-2xl text-gray-700 text-center">Trending&nbsp;<span className="text-2xl font-semibold uppercase">Categories</span></h1>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        {categories.slice(0, 4).map((category, index) => (
                            <TopCategoryCard key={index} imageSrc={category.image_url} name={category.name} to={`/categories/${category.id}/products`} />
                        ))}
                    </div>

                </div>
            )}

            <div className="p-10 lg:px-40 bg-gray-100 grid md:grid-cols-2 gap-10">
                <img className="flex-1 w-full aspect-video bg-white md:col-start-2 md:col-end-3" src="https://jxguxsydhgtsizezswyy.supabase.co/storage/v1/object/public/assets/landing-image.jpg" alt="Landing Image" />
                <div className="flex-1 self-center md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2">
                    <h1 className="text-3xl text-gray-700">Take Your Website to&nbsp;<span className="text-3xl font-semibold uppercase">New Heights</span>&nbsp;with us.</h1>
                    <p className="mt-10 text-lg text-gray-700">ThemeBucket offers a diverse range of theme templates that are designed to empower your online presence. Unlock limitless possibilities and watch your business thrive!"</p>
                    <Link className="inline-block mt-10 py-2 px-4 rounded-md border text-white font-semibold text-lg bg-gray-700 hover:bg-gray-800 transition-all" to="/categories">Get Started!</Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage