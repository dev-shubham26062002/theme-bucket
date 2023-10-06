import { FiSearch } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import cn from '@/utils/cn'
import IconButton from '@/components/general/IconButton'
import useDebounce from '@/hooks/useDebounce'
import { Database } from '@/utils/supabaseTypes'
import supabase from '@/libs/supabaseClient'

interface SearchbarProps {
    className?: string,
}

const Searchbar: React.FC<SearchbarProps> = ({
    className,
}) => {
    const [searchQuery, setSearchQuery] = useState('')

    const debouncedSearchQuery = useDebounce(searchQuery, 1000)

    const [searchResults, setSearchResults] = useState<(Database['public']['Tables']['products']['Row'] & { categories: Database['public']['Tables']['categories']['Row'] | null })[]>([])

    useEffect(() => {
        const getProducts = async () => {
            const { data: productsData } = await supabase.from('products').select('*, categories(*)').ilike('name', `%${debouncedSearchQuery}%`)

            setSearchResults(productsData || [])
        }

        if (debouncedSearchQuery.trim() !== '') {
            getProducts()
        } else {
            setSearchResults([])
        }
    }, [debouncedSearchQuery])

    return (
        <div className={cn('relative', className)}>
            <form className="flex items-center rounded-full overflow-hidden border border-gray-400 focus-within:ring-2 ring-yellow-ochre p-1">
                <input className="flex-1 focus:outline-none focus-visible:outline-none text-sm text-gray-700 pl-3" placeholder="I'm looking for..." onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)} />
                <IconButton className="hover:bg-yellow-ochre" disabled={true} icon={FiSearch} />
            </form>

            {searchResults.length > 0 && (
                <div className="absolute w-full mt-2 z-50 bg-white rounded-md border border-gray-200 overflow-hidden shadow shadow-gray-200 flex flex-col gap-y-2">

                    {searchResults.map((product, index) => (
                        <Link key={index} className="p-2 overflow-hidden flex items-center gap-x-2 hover:bg-gray-100 transition-all" to={`/categories/${product.categories?.id}/products/${product.id}`} onClick={() => {
                            setSearchQuery('')
                            setSearchResults([])
                        }}>
                            <img className="w-20 aspect-video object-cover rounded-sm" src={product.main_image_url} alt={product.name} />
                            <h1 className="flex-1 truncate font-semibold text-charcoal text-sm">{product.name}</h1>
                        </Link>
                    ))}

                </div>
            )}
        </div >
    )
}

export default Searchbar