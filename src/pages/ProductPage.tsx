import { useLoaderData, useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { BiHeart, BiSolidHeart } from 'react-icons/bi'
import toast from 'react-hot-toast'
import { FiDownload, FiShoppingBag } from 'react-icons/fi'
import { GoBrowser } from 'react-icons/go'
import { format, formatDistanceToNow } from 'date-fns'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import ImageDisplayer from '@/components/product-page/ImageDisplayer'
import { IoMdCheckmark, IoMdClose } from 'react-icons/io'
import RatingStars from '@/components/product-page/RatingStars'
import Heading from '@/components/general/Heading'
import Button from '@/components/general/Button'
import AddReviewModal from '@/components/product-page/AddReviewModal'
// import addToCart from '@/utils/addToCart'

export const productPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: productsData } = await supabase.from('products').select('*, categories(*), profiles(*), reviews(*, profiles(*)), liked_products(*)')

        const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', sessionData.session?.user.id as string).eq('is_completed', false).single()

        const { data: purchasedProductData } = await supabase.from('purchased_products').select('*').eq('user_id', sessionData.session?.user.id as string)

        return [sessionData.session, productsData, orderData, purchasedProductData]
    } catch (error) {
        throw new Error('ERROR_AT_PRODUCT_PAGE_LOADER' + error)
    }
}

const ProductPage = () => {
    const [session, products, order, purchasedProducts] = useLoaderData() as [Session, (Database['public']['Tables']['products']['Row'] & { profiles: Database['public']['Tables']['profiles']['Row'] | null, categories: Database['public']['Tables']['categories']['Row'], reviews: (Database['public']['Tables']['reviews']['Row'] & { profiles: Database['public']['Tables']['profiles']['Row'] | null })[], liked_products: Database['public']['Tables']['liked_products']['Row'][] })[], (Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null }) | null, Database['public']['Tables']['purchased_products']['Row'][] | null]

    const { categoryId, productId } = useParams()

    const product = products.find((product) => product?.id === productId)

    const isAlreadyPurchased = (purchasedProducts || [])?.find((purchasedProduct) => purchasedProduct.product_id === product?.id) ? true : false

    const navigate = useNavigate()

    useEffect(() => {
        if (!product) {
            navigate(`/categories/${categoryId}/products/${productId}/404-not-found`)
        }
    }, [])

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleLikeProductButtonClick = async () => {
        try {
            setIsLoading(true)

            const isAlreadyLiked = product?.liked_products.find((likedProduct) => likedProduct.user_id === session.user.id && likedProduct.product_id === product.id)

            if (isAlreadyLiked) {
                const { error } = await supabase.from('liked_products').delete().match({ user_id: session.user.id, product_id: product?.id })

                if (error) {
                    toast.error('Something went wrong. Please try again later.')
                } else {
                    navigate(`/categories/${categoryId}/products/${productId}`)
                }
            } else {
                const { error } = await supabase.from('liked_products').insert({ user_id: session.user.id, product_id: product?.id! })

                if (error) {
                    toast.error('Something went wrong. Please try again later.')
                } else {
                    navigate(`/categories/${categoryId}/products/${productId}`)
                }
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState<boolean>(false)

    const reviews = product?.reviews.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

    const handleAddToCartButtonClick = async () => {
        try {
            let currentOrder = order

            if (!currentOrder) {
                const { data: newOrderData, error: newOrderError } = await supabase.from('orders').insert({ user_id: session.user.id, is_completed: false }).select('*, order_items(*)').single()

                if (newOrderError) {
                    toast.error('Something went wrong. Please try again later.')
                    return
                }

                currentOrder = newOrderData
            }

            const isProductAlreadyInCart = currentOrder?.order_items?.find((orderItem) => orderItem.product_id === product?.id && orderItem.order_id === currentOrder?.id) ? true : false

            if (isProductAlreadyInCart) {
                toast.error('Product already in cart.')
                return
            }

            const { error: orderItemError } = await supabase.from('order_items').insert({ order_id: currentOrder?.id, product_id: product?.id })

            if (orderItemError) {
                toast.error('Something went wrong. Please try again later.')
                return
            }

            toast.success('Product added to cart successfully.')

            navigate(location.pathname)
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')
        }
    }

    if (!product) {
        return null
    }

    return (
        <>
            {isAddReviewModalOpen && (
                <AddReviewModal setIsAddReviewModalOpen={setIsAddReviewModalOpen} reviewId={product?.reviews.find((review) => review.user_id === session.user.id && review.product_id === product.id)?.id as string} rating={product?.reviews.find((review) => review.user_id === session.user.id && review.product_id === product.id)?.rating as number} message={product?.reviews.find((review) => review.user_id === session.user.id && review.product_id === product.id)?.message as string} session={session} productId={product.id} />
            )}

            <div className="p-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    <ImageDisplayer className="flex-1" images={[{ imageSrc: product.main_image_url, imageAlt: 'Main Image' }, ...JSON.parse(product.other_images_urls as string).map((url: string, index: number) => ({ imageSrc: url, imageAlt: `Other Image ${index + 1}` }))]} />
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-charcoal">{product.name}</h1>
                        <p className="text-gray-400">By {product.profiles?.full_name}</p>
                        <div className="mt-4 flex items-center gap-x-2">
                            <RatingStars rating={product.reviews.length === 0 ? 0 : product.reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / product.reviews.length} />
                            <span className="text-gray-400">({product.reviews.length})</span>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-charcoal">Rs. {product.price}</h1>

                        <div className="mt-4 flex items-start gap-x-4">

                            {!session ? (
                                <Link className="inline-block" to="/auth">
                                    <BiHeart className="w-8 h-8 text-red-700" />
                                </Link>
                            ) : (
                                <>

                                    {product.liked_products.find((likedProduct) => likedProduct.user_id === session.user.id && likedProduct.product_id === product.id) ? (
                                        <button disabled={isLoading} onClick={handleLikeProductButtonClick}>
                                            <BiSolidHeart className="w-8 h-8 text-red-700" />
                                        </button>
                                    ) : (
                                        <button disabled={isLoading} onClick={handleLikeProductButtonClick}>
                                            <BiHeart className="w-8 h-8 text-red-700" />
                                        </button>
                                    )}

                                </>
                            )}

                            <div className="w-full md:w-1/2 space-y-4">

                                {product.live_preview_url && (
                                    <Link className="flex justify-center items-center gap-x-2 py-2 text-gray-700 w-full rounded-md border border-gray-200 hover:bg-gray-100 transition-all font-semibold uppercase" to={product.live_preview_url}>
                                        <GoBrowser className="w-5 h-5" />
                                        <span className="text-sm">Live Preview</span>
                                    </Link>
                                )}

                                {session && isAlreadyPurchased ? (
                                    <Link className="flex justify-center items-center gap-x-2 py-2 text-gray-700 w-full rounded-md border border-gray-200 hover:bg-gray-100 transition-all font-semibold uppercase" to={product.source_code_url}>
                                        <FiDownload className="w-5 h-5" />
                                        <span className="text-sm">Download</span>
                                    </Link>
                                ) : (
                                    <button className="flex justify-center items-center gap-x-2 py-2 text-gray-700 w-full rounded-md border border-gray-200 hover:bg-gray-100 transition-all font-semibold uppercase" onClick={() => !session ? navigate('/auth') : handleAddToCartButtonClick()}>
                                        <FiShoppingBag className="w-5 h-5" />
                                        <span className="text-sm">Add to Cart</span>
                                    </button>
                                )}

                            </div>

                        </div>

                    </div>
                </div>
                <div className="mt-10 flex flex-col md:flex-row gap-10">
                    <div className="flex-1">

                        {product.description && (
                            <div>
                                <Heading title="Description" />
                                <div className="mt-6 text-gray-700" dangerouslySetInnerHTML={{ __html: product.description as string }}></div>
                            </div>
                        )}

                        <div className="mt-6 p-4 rounded-md border border-gray-200 shadow shadow-gray-200">
                            <div className="flex justify-between items-center gap-x-2">
                                <h1 className="uppercase font-bold text-gray-700">Published At</h1>
                                <span className="text-gray-700 font-medium py-2 px-4 rounded-full bg-gray-100 border border-gray-200 text-sm">{format(new Date(product.created_at), 'dd MMMM, yyyy')}</span>
                            </div>
                            <div className="my-4 h-px bg-gray-200"></div>
                            <div className="flex justify-between items-center gap-x-2">
                                <h1 className="uppercase font-bold text-gray-700">Main Category</h1>
                                <span className="text-gray-700 font-medium py-2 px-4 rounded-full bg-gray-100 border border-gray-200 text-sm">{product.categories.name}</span>
                            </div>
                            <div className="my-4 h-px bg-gray-200"></div>
                            <div className="flex flex-col gap-y-2">
                                <h1 className="uppercase font-bold text-gray-700">Sub Categories</h1>
                                <div className="flex gap-2 flex-wrap">

                                    {JSON.parse(product.sub_categories as string).map((item: string, index: number) => (
                                        <span key={index} className="text-gray-700 font-medium py-2 px-4 rounded-full bg-gray-100 border border-gray-200 text-sm">{item}</span>
                                    ))}

                                </div>
                            </div>
                            <div className="my-4 h-px bg-gray-200"></div>
                            <div className="flex flex-col gap-y-2">
                                <h1 className="uppercase font-bold text-gray-700">Tools Stack</h1>
                                <div className="flex gap-2 flex-wrap">

                                    {JSON.parse(product.tools_stack as string).map((item: string, index: number) => (
                                        <span key={index} className="text-gray-700 font-medium py-2 px-4 rounded-full bg-gray-100 border border-gray-200 text-sm">{item}</span>
                                    ))}

                                </div>
                            </div>
                            <div className="my-4 h-px bg-gray-200"></div>
                            <div className="flex flex-col gap-y-2">
                                <h1 className="uppercase font-bold text-gray-700">Compatible Browsers</h1>
                                <div className="flex gap-2 flex-wrap">

                                    {JSON.parse(product.compatible_browsers as string).map((item: string, index: number) => (
                                        <span key={index} className="text-gray-700 font-medium py-2 px-4 rounded-full bg-gray-100 border border-gray-200 text-sm">{item}</span>
                                    ))}

                                </div>
                            </div>
                            <div className="my-4 h-px bg-gray-200"></div>
                            <div className="flex justify-between items-center gap-x-2">
                                <h1 className="uppercase font-bold text-gray-700">Is Responsive?</h1>
                                <span className="text-gray-700 font-medium p-2 rounded-full bg-gray-100 border border-gray-200 text-sm">

                                    {product.is_responsive ? (
                                        <IoMdCheckmark className="w-5 h-5" />
                                    ) : (
                                        <IoMdClose className="w-5 h-5" />
                                    )}

                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center gap-x-2">
                            <h1 className="text-gray-700 font-bold">Reviews & Ratings ({product.reviews.length || 0})</h1>

                            {!session ? (
                                <Button label="Write a Review" onClick={() => navigate('/auth')} disabled={isLoading} />
                            ) : (
                                <Button label="Write a Review" disabled={isLoading} onClick={() => setIsAddReviewModalOpen(true)} />
                            )}

                        </div>
                        <div className="my-6 h-px bg-gray-200"></div>
                        <div className="flex flex-col gap-y-4">

                            {reviews?.length === 0 ? (
                                <p className="p-10 flex justify-center items-center rounded-lg border border-gray-200 text-gray-400 font-medium">No reviews available.</p>
                            ) : (
                                <>

                                    {reviews?.map((review, index) => (
                                        <div key={index} className="flex gap-x-4 p-4 rounded-md border border-gray-200">

                                            {review.profiles?.avatar_url ? (
                                                <img className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200" src={review.profiles.avatar_url as string} alt={review.profiles.full_name as string} />
                                            ) : (
                                                <span className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-100 border border-gray-200 text-gray-700 font-semibold">{review.profiles?.full_name?.slice(0, 2).toUpperCase()}</span>
                                            )}

                                            <div className="flex-1">
                                                <div className="flex justify-between gap-x-4">
                                                    <div>
                                                        <h1 className="text-gray-700 font-semibold">{review.profiles?.full_name}</h1>
                                                        <p className="text-gray-400 text-xs font-medium">{formatDistanceToNow(new Date(review.updated_at), { addSuffix: true })}</p>
                                                    </div>
                                                    <RatingStars rating={review.rating} />
                                                </div>
                                                <p className="mt-4 text-gray-700 text-sm">{review.message}</p>
                                            </div>

                                        </div>
                                    ))}

                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ProductPage