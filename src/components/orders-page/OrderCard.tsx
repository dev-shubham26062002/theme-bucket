import { format } from 'date-fns'
import { Session } from '@supabase/supabase-js'

import cn from '@/utils/cn'
import { Database } from '@/utils/supabaseTypes'
import OtherProductCard from '@/components/products-page/OtherProductCard'

interface OrderCardProps {
    className?: string,
    orderId: string,
    completedAt: string,
    order: Database['public']['Tables']['orders']['Row'] & { order_items: (Database['public']['Tables']['order_items']['Row'] & { products: (Database['public']['Tables']['products']['Row'] & { categories: Database['public']['Tables']['categories']['Row'] | null, profiles: Database['public']['Tables']['profiles']['Row'] | null, reviews: Database['public']['Tables']['reviews']['Row'][] | null }) | null })[] | null, purchased_products: Database['public']['Tables']['purchased_products']['Row'][] | null } | null,
    session: Session,
}

const OrderCard: React.FC<OrderCardProps> = ({
    className,
    orderId,
    completedAt,
    order,
    session,
}) => {
    return (
        <>
            <div className={cn('py-2 px-4 rounded-md border border-gray-200 bg-gray-100', className)}>
                <h1 className="font-semibold text-gray-700 text-sm">Order ID: {orderId}</h1>
                <p className="text-gray-400 font-medium text-sm">Completed At: {format(new Date(completedAt), 'dd MMMM, yyyy')}</p>
            </div>
            <div className="my-6 flex flex-col md:justify-center items-center gap-y-6">

                {order?.order_items?.map((orderItem, index) => (
                    <OtherProductCard key={index} to={`/categories/${orderItem.products?.categories?.name}/products/${orderItem.products?.id}`} imageSrc={orderItem.products?.main_image_url as string} name={orderItem.products?.name as string} publisherName={orderItem.products?.profiles?.full_name as string} averageRating={orderItem.products?.reviews?.length === 0 ? 0 : (orderItem.products?.reviews || []).reduce((accumulator, review) => accumulator + review.rating, 0) / (orderItem.products?.reviews?.length || 0)} ratingsCount={orderItem.products?.reviews?.length as number} price={orderItem.products?.price as number} order={order} session={session} productId={orderItem.products?.id as string} isAlreadyPurchased={order.purchased_products?.find((purchasedProduct) => purchasedProduct.product_id === orderItem.product_id) ? true : false} sourceCodeLink={orderItem.products?.source_code_url as string} />
                ))}

            </div>
        </>
    )
}

export default OrderCard