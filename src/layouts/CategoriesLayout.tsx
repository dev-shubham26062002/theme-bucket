import { useLoaderData, Outlet } from 'react-router-dom'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import CategoryLink from '@/components/categories-layout/CategoryLink'

export const categoriesLayoutLoader = async () => {
    try {
        const { data: categoriesData } = await supabase.from('categories').select('*').order('created_at', { ascending: false })

        return categoriesData
    } catch (error) {
        throw new Error('ERROR_AT_CATEGORIES_LAYOUT_LOADER' + error)
    }
}

const CategoriesLayout = () => {
    const categories = useLoaderData() as Database['public']['Tables']['categories']['Row'][]

    return (
        <div className="h-full flex flex-col lg:flex-row gap-2">
            <aside className="z-40 w-full lg:max-w-xs h-fit lg:min-h-screen bg-white border border-gray-200 shadow-lg shadow-gray-200  sticky top-0">
                <h1 className="text-gray-700 font-semibold py-2 px-4 border-b border-gray-200 hidden md:block">Browse Categories({categories.length})</h1>
                <nav className="flex gap-2 py-2 px-4 overflow-y-hidden lg:flex-wrap" id="categoriesNavbar">
                    <CategoryLink className="flex-shrink-0" to="/categories" label="All" end />

                    {categories.map((category, index) => (
                        <CategoryLink key={index} className="flex-shrink-0" to={`/categories/${category.id}/products`} label={category.name} />
                    ))}
                </nav>
            </aside>
            <div className="flex-1 border border-gray-200 shadow-lg shadow-gray-200">
                <Outlet />
            </div>
        </div>
    )
}

export default CategoriesLayout