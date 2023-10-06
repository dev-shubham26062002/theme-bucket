import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Session } from '@supabase/supabase-js'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import TopRatedProductCard from '@/components/products-page/TopRatedProductCard'
import OtherProductCard from '@/components/products-page/OtherProductCard'

export const categoryProductsPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: categoriesData } = await supabase.from('categories').select('*, products(*, profiles(*), reviews(*))').order('created_at', { ascending: false })

        const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', false).single()

        const { data: purchasedProductData } = await supabase.from('purchased_products').select('*').eq('user_id', sessionData.session?.user.id as string)

        return [sessionData.session, categoriesData, orderData, purchasedProductData]
    } catch (error) {
        throw new Error('ERROR_AT_CATEGORY_PRODUCTS_PAGE_LOADER' + error)
    }
}

const CategoryProductsPage = () => {
    const [session, categories, order, purchasedProducts] = useLoaderData() as [Session, (Database['public']['Tables']['categories']['Row'] & { products: (Database['public']['Tables']['products']['Row'] & { profiles: Database['public']['Tables']['profiles']['Row'], reviews: Database['public']['Tables']['reviews']['Row'][] })[] })[], (Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null }) | null, Database['public']['Tables']['purchased_products']['Row'][] | null]

    const { categoryId } = useParams()

    const category = categories.find((category) => category?.id === categoryId)

    const navigate = useNavigate()

    useEffect(() => {
        if (!category) {
            navigate(`/categories/${categoryId}/404-not-found`)
        }
    }, [])

    const products = category?.products.map((product) => ({
        ...product,
        averageRating: product.reviews.length === 0 ? 0 : product.reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / product.reviews.length,
    })).sort((a, b) => b.averageRating - a.averageRating)

    const topRatedProducts = products?.slice(0, 3) || []

    const otherProducts = products?.slice(3).sort((a, b) => b.created_at.localeCompare(a.created_at)) || []

    if (!category) {
        return null
    }

    return (
        <div className="p-10">

            {products?.length === 0 ? (
                <p className="p-10 flex justify-center items-center rounded-lg border border-gray-200 text-gray-400 font-medium">No products found.</p>
            ) : (
                <>
                    <h1 className="text-2xl text-gray-700 text-center">Top Rated&nbsp;<span className="text-2xl font-semibold uppercase">Products ({topRatedProducts?.length})</span></h1>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {topRatedProducts?.map((product, index) => (
                            <TopRatedProductCard key={index} to={`/categories/${category.id}/products/${product.id}`} imageSrc={product.main_image_url} name={product.name} publisherName={product.profiles.full_name || ''} averageRating={product.averageRating} ratingsCount={product.reviews.length || 0} price={product.price || 0} session={session} productId={product.id} order={order} alreadyPurchased={(purchasedProducts || []).find((purchasedProduct) => purchasedProduct.product_id === product.id) ? true : false} sourceCodeLink={product.source_code_url} />
                        ))}

                    </div>

                    {otherProducts?.length > 0 && (
                        <>
                            <h1 className="mt-10 text-2xl text-gray-700 text-center">Other&nbsp;<span className="text-2xl font-semibold uppercase">Products ({otherProducts?.length})</span></h1>

                            <div className="mt-10 flex flex-col items-center gap-y-6">

                                {otherProducts?.map((product, index) => (
                                    <OtherProductCard key={index} to={`/categories/${category.id}/products/${product.id}`} imageSrc={product.main_image_url} name={product.name} publisherName={product.profiles.full_name || ''} averageRating={product.averageRating} ratingsCount={product.reviews.length || 0} price={product.price || 0} order={order} productId={product.id} session={session} isAlreadyPurchased={(purchasedProducts || []).find((purchasedProduct) => purchasedProduct.product_id === product.id) ? true : false} sourceCodeLink={product.source_code_url} />
                                ))}

                            </div>
                        </>
                    )}
                </>
            )}

        </div >
    )
}

export default CategoryProductsPage