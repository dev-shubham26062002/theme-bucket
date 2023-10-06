import { useLoaderData } from 'react-router-dom'

import supabase from '@/libs/supabaseClient'
import { Database } from '@/utils/supabaseTypes'

export const sellerDashboardPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: productsData } = await supabase.from('products').select('*, purchased_products(*, profiles(*), products(*))').eq('user_id', sessionData.session?.user.id as string)

        return productsData
    } catch (error) {
        throw new Error('ERROR_AT_SELLER_DASHBOARD_PAGE_LOADER' + error)
    }
}

const SellerDashboardPage = () => {
    const products = useLoaderData() as (Database['public']['Tables']['products']['Row'] & { purchased_products: Database['public']['Tables']['purchased_products']['Row'][] | null })[] | null

    const customersIds = products?.map((product) => product.purchased_products?.map((purchasedProduct) => purchasedProduct.user_id))?.flat()

    const uniqueCustomerIds = customersIds?.filter((item, index) => customersIds.indexOf(item) === index)

    const totalRevenueAmount = products?.length === 0 ? 0 : products?.reduce((accumulator, product) => accumulator + (product.purchased_products || [])?.length * product.price, 0)

    return (
        <div className="p-10">
            <h1 className="text-2xl text-gray-700 text-center">Sales&nbsp;<span className="text-2xl font-semibold uppercase">Overview</span></h1>
            <div className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-md border border-gray-200 shadow-sm shadow-gray-200">
                        <p className="font-semibold text-gray-700 text-lg">Total Products:</p>
                        <h1 className="font-bold text-2xl mt-4 text-gray-700">+ {products?.length || 0}</h1>
                    </div>
                    <div className="p-6 rounded-md border border-gray-200 shadow-sm shadow-gray-200">
                        <p className="font-semibold text-gray-700 text-lg">Total Customers:</p>
                        <h1 className="font-bold text-2xl mt-4 text-gray-700">+ {uniqueCustomerIds?.length || 0}</h1>
                    </div>
                    <div className="p-6 rounded-md border border-gray-200 shadow-sm shadow-gray-200">
                        <p className="font-semibold text-gray-700 text-lg">Total Revenue:</p>
                        <h1 className="font-bold text-2xl mt-4 text-gray-700">Rs. {totalRevenueAmount}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerDashboardPage