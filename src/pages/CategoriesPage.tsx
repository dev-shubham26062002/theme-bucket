import { useLoaderData } from 'react-router-dom'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import TopCategoryCard from '@/components/categories-page/TopCategoryCard'
import OtherCategoryCard from '@/components/categories-page/OtherCategoryCard'

export const categoriesPageLoader = async () => {
    try {
        const { data: categoriesData } = await supabase.from('categories').select('*').order('created_at', { ascending: false })

        return categoriesData
    } catch (error) {
        throw new Error('ERROR_AT_CATEGORIES_LAYOUT_LOADER' + error)
    }
}

const CategoriesPage = () => {
    const categories = useLoaderData() as Database['public']['Tables']['categories']['Row'][]

    return (
        <div className="p-10">
            <h1 className="text-2xl text-gray-700 text-center">New&nbsp;<span className="text-2xl font-semibold uppercase">Categories ({categories.slice(0, 4).length || 0})</span></h1>

            {categories.length === 0 ? (
                <p className="mt-10 p-10 flex justify-center items-center rounded-lg border border-gray-200 text-gray-400 font-medium">No categories found.</p>
            ) : (
                <>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {categories.slice(0, 4).map((category, index) => (
                            <TopCategoryCard key={index} to={`/categories/${category.id}/products`} imageSrc={category.image_url} name={category.name} />
                        ))}

                    </div>

                    {categories.slice(4).length > 0 && (
                        <>
                            <h1 className="mt-10 text-2xl text-gray-700 text-center">Other&nbsp;<span className="text-2xl font-semibold uppercase">Categories ({categories.slice(4).length || 0})</span></h1>
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                                {categories.slice(4).map((category, index) => (
                                    <OtherCategoryCard key={index} to={`/categories/${category.id}/products`} imageSrc={category.image_url} name={category.name} />
                                ))}

                            </div>
                        </>
                    )}

                </>
            )}

        </div >
    )
}

export default CategoriesPage