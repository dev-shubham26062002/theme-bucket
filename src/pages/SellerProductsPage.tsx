import { useLoaderData, Link } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { IoMdAdd } from 'react-icons/io'
import { FiSearch, FiEdit } from 'react-icons/fi'
import { MdOutlineTabletMac, MdOutlineDesktopMac } from 'react-icons/md'
import { useForm, FieldValues } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'
import IconButton from '@/components/general/IconButton'
import { sellerProductsSearchSchema } from '@/utils/formSchema'
import ProductBuyersListModal from '@/components/seller-products-page/ProductBuyersListModal'

export const sellerProductsPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: profileData } = await supabase.from('profiles').select('*, products(*, categories(*), purchased_products(*, profiles(*)))').eq('id', sessionData.session?.user.id as string).single()

        return [sessionData.session, profileData]
    } catch (error) {
        throw new Error('ERROR_AT_SELLER_PRODUCTS_PAGE_LOADER' + error)
    }
}

const SellerProductsPage = () => {
    const [session, profile] = useLoaderData() as [Session, Database['public']['Tables']['profiles']['Row'] & { products: (Database['public']['Tables']['products']['Row'] & { categories: Database['public']['Tables']['categories']['Row'] | null, purchased_products: (Database['public']['Tables']['purchased_products']['Row'] & { profiles: Database['public']['Tables']['profiles']['Row'] | null })[] | null })[] | null } | null]

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<z.infer<typeof sellerProductsSearchSchema> | FieldValues>({
        resolver: zodResolver(sellerProductsSearchSchema),
        defaultValues: {
            query: '',
        },
    })

    const [filteredProducts, setFilteredProducts] = useState<(Database['public']['Tables']['products']['Row'] & { categories: Database['public']['Tables']['categories']['Row'] | null, purchased_products: (Database['public']['Tables']['purchased_products']['Row'] & { profiles: Database['public']['Tables']['profiles']['Row'] | null })[] | null })[]>((profile?.products || []).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))

    const handleSubmitButtonClick = (values: z.infer<typeof sellerProductsSearchSchema> | FieldValues) => {
        const filteredProducts = values.query.trim() !== '' ? profile?.products?.filter(product => product.name.toLowerCase().includes(values.query.toLowerCase())) : profile?.products

        setFilteredProducts(filteredProducts || [])
    }

    const [isProductBuyersListModalOpen, setIsProductBuyersListModalOpen] = useState(false)

    const [productBuyersListData, setProductBuyersListData] = useState<(Database['public']['Tables']['purchased_products']['Row'] & { profiles: Database['public']['Tables']['profiles']['Row'] | null })[] | null>(null)

    return (
        <>
            {isProductBuyersListModalOpen && (
                <ProductBuyersListModal productBuyersListData={productBuyersListData} setIsProductBuyersListModalOpen={setIsProductBuyersListModalOpen} />
            )}

            <div className="p-10">
                <div className="flex items-center gap-x-2">
                    <h1 className="text-2xl text-gray-700 text-center">My&nbsp;<span className="text-2xl font-semibold uppercase">Products ({profile?.products?.length || 0})</span></h1>
                    <Link className="ml-auto py-2 px-4 rounded-md bg-gray-700 text-white hover:bg-gray-800 transition-all" to={`/profile/${session.user.id}/seller-dashboard/products/add-product`}>
                        <IoMdAdd className="w-5 h-5" />
                    </Link>
                </div>
                <div className="my-6 h-px bg-gray-200"></div>
                <form className="flex items-center gap-x-2" onSubmit={handleSubmit(handleSubmitButtonClick)}>
                    <input className="focus:outline-none focus-visible:outline-none text-sm py-2 px-4 rounded-md border border-gray-200 focus:ring-2 ring-yellow-ochre w-full max-w-xs text-gray-700" id="query" placeholder="Filter products..." disabled={isSubmitting} {...register('query')} />
                    <IconButton disabled={isSubmitting} type="submit" icon={FiSearch} />
                </form>
                <div className="mt-6 p-10 flex flex-col justify-center items-center gap-y-6 rounded-md border border-gray-200 text-gray-400 text-center md:hidden">
                    <div className="flex gap-x-6">
                        <MdOutlineTabletMac className="w-10 h-10" />
                        <MdOutlineDesktopMac className="w-10 h-10" />
                    </div>
                    <p className="text-sm">Please switch to a larger screen to view your products.</p>
                </div>
                <div className="mt-6 hidden md:grid grid-cols-12 gap-1">
                    <h1 className="py-2 px-4 bg-charcoal font-semibold uppercase text-white col-start-1 col-end-6">Product Details</h1>
                    <h1 className="py-2 px-4 bg-charcoal font-semibold uppercase text-white col-start-6 col-end-11">Sales Details</h1>
                    <h1 className="py-2 px-4 bg-charcoal font-semibold uppercase text-white col-start-11 col-end-13">Actions</h1>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="mt-1 hidden md:block">

                        {filteredProducts.map((product, index) => (
                            <div key={index} className="grid grid-cols-12 gap-1">
                                <div className="py-2 px-4 flex flex-col gap-y-1 col-start-1 col-end-6 border border-gray-200 bg-gray-100">
                                    <Link className="font-bold text-gray-700 truncate hover:underline transition-all" to={`/categories/${product.categories?.id}/products/${product.id}`}>{product.name}</Link>
                                    <span className="text-sm font-medium text-gray-400">Last Updated At: {formatDistanceToNow(new Date(product?.updated_at), { addSuffix: true })}</span>
                                </div>
                                <div className="py-2 px-4 border border-gray-200 bg-gray-100 col-start-6 col-end-11 flex justify-center items-center">
                                    <button className="text-sm text-gray-700 font-medium hover:text-yellow-ochre transition-all" onClick={() => {
                                        setProductBuyersListData(product.purchased_products?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || null)
                                        setIsProductBuyersListModalOpen(true)
                                    }}>Purchased by {product.purchased_products?.length || 0} people</button>
                                </div>
                                <div className="py-2 px-4 border border-gray-200 bg-gray-100 col-start-11 col-end-13 flex justify-center items-center">
                                    <Link className="flex items-center gap-x-1 text-gray-700 font-medium hover:text-yellow-ochre transition-all" to={`/profile/${session.user.id}/seller-dashboard/products/${product.id}`}>
                                        <FiEdit className="w-5 h-4" />
                                        <span className="text-sm">Edit</span>
                                    </Link>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="mt-1 hidden md:block p-10 border border-gray-200 bg-gray-100 text-sm font-medium text-center text-gray-700">No products found.</div>
                )}

            </div>
        </>
    )
}

export default SellerProductsPage