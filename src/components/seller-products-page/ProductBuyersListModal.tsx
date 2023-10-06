import { IoMdClose } from 'react-icons/io'
import { format } from 'date-fns'

import { Database } from '@/utils/supabaseTypes'
import IconButton from '../general/IconButton'

interface ProductBuyersListModalProps {
    productBuyersListData: (Database['public']['Tables']['purchased_products']['Row'] & { profiles: Database['public']['Tables']['profiles']['Row'] | null })[] | null,
    setIsProductBuyersListModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const ProductBuyersListModal: React.FC<ProductBuyersListModalProps> = ({
    productBuyersListData,
    setIsProductBuyersListModalOpen,
}) => {
    return (
        <div className="fixed z-40 inset-0 flex justify-center items-center px-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-white rounded-md border border-gray-200 shadow-lg shadow-gray-200 relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => setIsProductBuyersListModalOpen(false)} icon={IoMdClose} />
                <h1 className="text-2xl font-semibold text-brown text-center">Product Buyers</h1>
                <p className="mt-6 text-sm text-charcoal font-medium text-center">List of all users who have bought this product.</p>

                {!productBuyersListData || productBuyersListData.length === 0 ? (
                    <p className="mt-6 p-10 flex justify-center items-center rounded-lg border border-gray-200 text-gray-400 font-medium">No one have bought this product yet.</p>
                ) : (
                    <div className="mt-6 flex flex-col gap-y-2 max-h-96 overflow-y-auto">

                        {productBuyersListData.map((item, index) => (
                            <div key={index} className="flex items-center gap-x-2 py-2 px-4 rounded-md border border-gray-200">

                                {item.profiles?.avatar_url ? (
                                    <img className="w-10 h-10 object-cover rounded-full border border-gray-200 bg-gray-100" src={item.profiles?.avatar_url as string} alt={item.profiles?.full_name as string} />
                                ) : (
                                    <span className="w-10 h-10 flex justify-center items-center border border-gray-200 rounded-full bg-gray-100 text-gray-700 font-semibold">{item.profiles?.full_name?.slice(0, 2).toUpperCase()}</span>
                                )}
                                <div className="flex-1">
                                    <h1 className="text-charcoal text-center font-semibold">{item.profiles?.full_name}</h1>
                                    <p className="text-xs text-gray-400 text-center">Purchased At: {format(new Date(item.created_at), 'dd MMMM, yyyy')}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    )
}

export default ProductBuyersListModal