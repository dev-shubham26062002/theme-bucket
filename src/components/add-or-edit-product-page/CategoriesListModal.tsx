import { IoMdClose } from 'react-icons/io'

import IconButton from '@/components/general/IconButton'
import { Database } from '@/utils/supabaseTypes'

interface CategoriesListModalProps {
    setIsCategoriesListModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    categoriesListData: Database['public']['Tables']['categories']['Row'][] | null,
}

const CategoriesListModal: React.FC<CategoriesListModalProps> = ({
    setIsCategoriesListModalOpen,
    categoriesListData,
}) => {
    return (
        <div className="fixed z-40 inset-0 flex justify-center items-center px-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-white rounded-md border border-gray-200 shadow-lg shadow-gray-200 relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => setIsCategoriesListModalOpen(false)} icon={IoMdClose} />
                <h1 className="text-2xl font-semibold text-brown text-center">Categories List</h1>
                <p className="mt-6 text-sm text-charcoal font-medium text-center">List of all categories added by you.</p>

                {!categoriesListData || categoriesListData.length === 0 ? (
                    <p className="mt-6 p-10 flex justify-center items-center rounded-lg border border-gray-200 text-gray-400 font-medium">You haven't added any category yet.</p>
                ) : (
                    <div className="mt-6 flex flex-col gap-y-2 max-h-96 overflow-y-auto">

                        {categoriesListData.map((item, index) => (
                            <div key={index} className="py-2 px-4 flex items-center gap-x-2 rounded-md border border-gray-200">
                                <img className="w-20 aspect-video object-cover rounded-sm border border-gray-200" src={item.image_url} alt={item.name} />
                                <h1 className="flex-1 text-center font-semibold text-charcoal">{item.name}</h1>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    )
}

export default CategoriesListModal