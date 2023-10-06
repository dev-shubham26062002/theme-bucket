import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiTrash } from 'react-icons/fi'
import toast from 'react-hot-toast'

import supabase from '@/libs/supabaseClient'
import IconButton from '@/components/general/IconButton'
import cn from '@/utils/cn'

interface CartRowProps {
    className?: string,
    to: string,
    imageSrc: string,
    name: string,
    price: number,
    orderId: string,
    productId: string,
}

const CartRow: React.FC<CartRowProps> = ({
    className,
    to,
    imageSrc,
    name,
    price,
    orderId,
    productId,
}) => {
    const navigate = useNavigate()

    const location = useLocation()

    const removeFromCart = async () => {
        try {
            const { error: orderItemError } = await supabase.from('order_items').delete().eq('order_id', orderId).eq('product_id', productId)

            if (orderItemError) {
                toast.error('Something went wrong. Please try again later.')
                return
            }

            toast.success('Product removed from cart successfully.')
            navigate(location.pathname)
        } catch (error) {
            toast.error('Something went wrong. Please try again later.')
        }
    }

    return (
        <div className={cn('p-4 rounded-md bg-gray-100 border border-gray-200 shadow shadow-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-6', className)}>
            <Link className="rounded-md border border-gray-200 overflow-hidden w-full" to={to}>
                <img className="w-full aspect-video object-cover bg-white" src={imageSrc} alt={name} />
            </Link>
            <Link className="col-start-1 col-end-2 row-start-2 row-end-3 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2 text-gray-700 font-semibold text-center self-center" to={to}>{name}</Link>
            <Link className="col-start-1 col-end-2 row-start-3 row-end-4 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2 text-gray-700 font-bold text-center self-center" to={to}>Rs. {price}</Link>
            <div className="col-start-2 col-end-3 lg:col-start-4 lg:col-end-5 flex items-center justify-center">
                <IconButton className="bg-gray-700 hover:bg-gray-800" icon={FiTrash} onClick={removeFromCart} />
            </div>
        </div>
    )
}

export default CartRow