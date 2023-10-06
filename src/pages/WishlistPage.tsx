import { useLoaderData } from 'react-router-dom'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import TopRatedProductCard from '@/components/products-page/TopRatedProductCard'
import { Session } from '@supabase/supabase-js'

export const wishlistPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: likedProductsData } = await supabase.from('liked_products').select('*, products(*, categories(*), profiles(*), reviews(*))').eq('user_id', sessionData.session?.user.id as string)

        const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', false).single()

        const { data: purchasedProductData } = await supabase.from('purchased_products').select('*').eq('user_id', sessionData.session?.user.id as string)

        return [sessionData.session, likedProductsData, orderData, purchasedProductData]
    } catch (error) {
        throw new Error('ERROR_AT_WISHLIST_PAGE_LOADER' + error)
    }
}

const WishlistPage = () => {
    const [session, likedProducts, order, purchasedProducts] = useLoaderData() as [Session, (Database['public']['Tables']['liked_products']['Row'] & { products: (Database['public']['Tables']['products']['Row'] & { categories: Database['public']['Tables']['categories']['Row'] | null, profiles: Database['public']['Tables']['profiles']['Row'] | null, reviews: Database['public']['Tables']['reviews']['Row'][] }) | null })[], (Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null }) | null, Database['public']['Tables']['purchased_products']['Row'][] | null]

    return (
        <div className="p-10">
            <h1 className="text-2xl text-gray-700 text-center">My&nbsp;<span className="text-2xl font-semibold uppercase">Wishlist ({likedProducts.length || 0})</span></h1>

            {likedProducts.length === 0 ? (
                <p className="mt-10 p-10 flex justify-center items-center rounded-lg border border-gray-200 text-gray-400 font-medium">Your wishist is empty.</p>
            ) : (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {likedProducts.map((likedProduct, index) => (
                        <TopRatedProductCard key={index} to={`/categories/${likedProduct.products?.categories?.id}/products/${likedProduct.products?.id}`} imageSrc={likedProduct.products?.main_image_url as string} name={likedProduct.products?.name as string} publisherName={likedProduct.products?.profiles?.full_name || ''} averageRating={likedProduct.products?.reviews.length === 0 ? 0 : (likedProduct.products?.reviews || []).reduce((accumulator, review) => accumulator + review.rating, 0) / (likedProduct.products?.reviews || []).length} ratingsCount={likedProduct.products?.reviews.length || 0} price={likedProduct.products?.price || 0} session={session} productId={likedProduct.products?.id as string} order={order} alreadyPurchased={(purchasedProducts || []).find((purchasedProduct) => purchasedProduct.product_id === likedProduct.products?.id) ? true : false} sourceCodeLink={likedProduct.products?.source_code_url as string} />
                    ))}

                </div>
            )}

        </div>
    )
}

export default WishlistPage