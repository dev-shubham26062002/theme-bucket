import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BsStarFill } from 'react-icons/bs'
import { FiDownload, FiShoppingBag } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { Session } from '@supabase/supabase-js'

import { Database } from '@/utils/supabaseTypes'
import cn from '@/utils/cn'
import supabase from '@/libs/supabaseClient'

interface TopRatedProductCardProps {
    className?: string,
    to: string,
    imageSrc: string,
    name: string,
    publisherName: string,
    averageRating: number,
    ratingsCount: number,
    price: number,
    session: Session,
    productId: string,
    order: (Database['public']['Tables']['orders']['Row'] & { order_items: Database['public']['Tables']['order_items']['Row'][] | null }) | null,
    alreadyPurchased: boolean,
    sourceCodeLink: string,
}

const TopRatedProductCard: React.FC<TopRatedProductCardProps> = ({
    className,
    to,
    imageSrc,
    name,
    publisherName,
    averageRating,
    ratingsCount,
    price,
    session,
    productId,
    order,
    alreadyPurchased,
    sourceCodeLink,
}) => {
    const navigate = useNavigate()

    const location = useLocation()

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

            const isProductAlreadyInCart = currentOrder?.order_items?.find((orderItem) => orderItem.product_id === productId && orderItem.order_id === currentOrder?.id) ? true : false

            if (isProductAlreadyInCart) {
                toast.error('Product already in cart.')
                return
            }

            const { error: orderItemError } = await supabase.from('order_items').insert({ order_id: currentOrder?.id, product_id: productId })

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

    return (
        <div className={cn('rounded-md border border-gray-200 shadow shadow-gray-200 overflow-hidden hover:-translate-y-1 transition-all transform-gpu hover:shadow-md', className)}>
            <Link className="w-full" to={to}>
                <img className="w-full aspect-video object-cover bg-white" src={imageSrc} alt={name} />
                <div className="p-4">
                    <h1 className="text-charcoal font-semibold truncate text-lg">{name}</h1>
                    <p className="text-gray-400 text-sm">by {publisherName}</p>
                    <div className="mt-4 flex justify-between items-center gap-x-2">
                        <div className="flex items-center gap-x-2">
                            <span className="text-charcoal font-semibold">{averageRating.toFixed(1)}</span>
                            <BsStarFill className="w-5 h-5 text-yellow-ochre" />
                            <span className="text-gray-400 text-sm">({ratingsCount})</span>
                        </div>
                        <span className="text-lg text-charcoal font-bold">Rs. {price}</span>
                    </div>
                </div>
            </Link>
            <div className="p-4 pt-0">

                {session && alreadyPurchased ? (
                    <Link className="flex justify-center items-center gap-x-2 py-2 text-gray-700 w-full rounded-md border border-gray-200 hover:bg-gray-100 transition-all font-semibold uppercase" to={sourceCodeLink}>
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
    )
}

export default TopRatedProductCard