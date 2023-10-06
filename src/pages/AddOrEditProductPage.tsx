import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiImage, FiFile } from 'react-icons/fi'
import { RiFolderZipLine } from 'react-icons/ri'
import { IoMdClose } from 'react-icons/io'
import toast from 'react-hot-toast'
import { AiOutlineWarning } from 'react-icons/ai'

import { Database } from '@/utils/supabaseTypes'
import supabase from '@/libs/supabaseClient'
import { addOrEditProductSchema } from '@/utils/formSchema'
import Input from '@/components/general/Input'
import Select from '@/components/general/Select'
import RichTextEditor from '@/components/add-or-edit-product-page/RichTextEditor'
import Heading from '@/components/general/Heading'
import Checkbox from '@/components/general/Checkbox'
import List from '@/components/add-or-edit-product-page/List'
import Button from '@/components/general/Button'
import FileInput from '@/components/add-or-edit-product-page/FileInput'
import IconButton from '@/components/general/IconButton'
import useFileUploadModal from '@/hooks/useFileUploadModal'
import AddCategoryModal from '@/components/add-or-edit-product-page/AddCategoryModal'
import CategoriesListModal from '@/components/add-or-edit-product-page/CategoriesListModal'

export const addOrEditProductPageLoader = async () => {
    try {
        const { data: sessionData } = await supabase.auth.getSession()

        const { data: profileData } = await supabase.from('profiles').select('*, categories(*), products(*)').eq('id', sessionData.session?.user.id as string).single()

        const { data: categoriesData } = await supabase.from('categories').select('*').order('name', { ascending: true })

        return [sessionData.session, profileData, categoriesData]
    } catch (error) {
        throw new Error('ERROR_AT_ADD_OR_EDIT_PRODUCT_PAGE_LOADER' + error)
    }
}

const AddOrEditProductPage = () => {
    const [session, profile, categories] = useLoaderData() as [Session, Database['public']['Tables']['profiles']['Row'] & { categories: Database['public']['Tables']['categories']['Row'][], products: Database['public']['Tables']['products']['Row'][] }, Database['public']['Tables']['categories']['Row'][]]

    const { productId } = useParams()

    const product = profile.products.find((product) => product.id === productId)

    const navigate = useNavigate()

    useEffect(() => {
        if (productId !== 'add-product' && !product) {
            navigate(`/profile/${session.user.id}/seller-dashboard/products/${productId}/404-not-found`)
        }
    }, [])

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<z.infer<typeof addOrEditProductSchema> | FieldValues>({
        resolver: zodResolver(addOrEditProductSchema),
        defaultValues: product ? ({
            name: product.name || '',
            price: product.price.toString() || '',
            mainCategory: product.category_id || '',
            description: product.description || '',
            isResponsive: product.is_responsive || false,
            subCategories: JSON.parse(product.sub_categories as string) || [],
            toolsStack: JSON.parse(product.tools_stack as string) || [],
            compatibleBrowsers: JSON.parse(product.compatible_browsers as string) || [],
            livePreviewUrl: product.live_preview_url || '',
            mainImageUrl: product.main_image_url || '',
            sourceCodeUrl: product.source_code_url || '',
            otherImagesUrls: JSON.parse(product.other_images_urls as string) || [],
        }) : ({
            name: '',
            price: '',
            mainCategory: '',
            description: '',
            isResponsive: false,
            subCategories: [],
            toolsStack: [],
            compatibleBrowsers: [],
            livePreviewUrl: '',
            mainImageUrl: '',
            sourceCodeUrl: '',
            otherImagesUrls: [],
        }),
    })

    const handleSubmitButtonClick = async (values: z.infer<typeof addOrEditProductSchema> | FieldValues) => {
        try {
            const { error: productError } = await supabase.from('products').upsert({
                id: product && product.id,
                name: values.name,
                price: values.price,
                category_id: values.mainCategory,
                description: values.description,
                is_responsive: values.isResponsive,
                sub_categories: JSON.stringify(values.subCategories),
                tools_stack: JSON.stringify(values.toolsStack),
                compatible_browsers: JSON.stringify(values.compatibleBrowsers),
                live_preview_url: values.livePreviewUrl,
                main_image_url: values.mainImageUrl,
                source_code_url: values.sourceCodeUrl,
                other_images_urls: JSON.stringify(values.otherImagesUrls),
                user_id: session.user.id,
            })

            if (productError) {
                toast.error('Something went wrong, please try again later.')
            } else {
                toast.success('Product added successfully.')
                navigate(`/profile/${session.user.id}/seller-dashboard/products`)
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    const { setIsOpen, setTitle, setDescription, setAcceptedTypes, setBucketName, setOnSuccessfullUploadCallback } = useFileUploadModal()

    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false)

    const [isCategoriesListModalOpen, setIsCategoriesListModalOpen] = useState<boolean>(false)

    if (productId !== 'add-product' && !product) {
        return null
    }

    return (
        <>
            {isAddCategoryModalOpen && (
                <AddCategoryModal setIsAddCategoryModalOpen={setIsAddCategoryModalOpen} session={session} />
            )}

            {isCategoriesListModalOpen && (
                <CategoriesListModal setIsCategoriesListModalOpen={setIsCategoriesListModalOpen} categoriesListData={profile.categories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())} />
            )}

            <div className="py-2 px-4 flex items-center gap-x-2 bg-gray-100 border border-gray-200 text-gray-700">
                <AiOutlineWarning className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{productId === 'add-product' ? 'Once you add a product, you are not able to delete it.' : 'Disabled fields are not editable.'}</span>
            </div>
            <div className="p-10">
                <h1 className="text-2xl text-gray-700 text-center">{productId === 'add-product' ? 'Add' : 'Edit'}&nbsp;<span className="text-2xl font-semibold uppercase">Product</span></h1>
                <form className="mt-10" onSubmit={handleSubmit(handleSubmitButtonClick)}>
                    <Heading title="Basic Information" />
                    <div className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Input id="name" label="Name" disabled={isSubmitting} register={register} errors={errors} />
                            <Input id="price" label="Price" disabled={productId === 'add-product' ? isSubmitting : true} register={register} errors={errors} />
                            <Select className="md:col-start-1 md:col-end-3 lg:col-start-3 lg:col-end-4" id="mainCategory" label="Main Category" disabled={isSubmitting} register={register} defaultValue={watch('mainCategory')} optionsData={categories.map((category) => ({ value: category.id, label: category.name }))} errors={errors} />
                        </div>
                        <p className="text-charcoal font-medium text-sm">Can't find your category?&nbsp;<button className="text-yellow-ochre font-medium hover:underline transition-all" type="button" onClick={() => setIsAddCategoryModalOpen(true)}>Add category</button>&nbsp;or,&nbsp;<button className="text-yellow-ochre font-medium hover:underline transition-all" type="button" onClick={() => setIsCategoriesListModalOpen(true)}>Click here</button>&nbsp;to view all categories added by you.</p>
                        <RichTextEditor id="description" label="Description" value={watch('description')} onChange={(value) => setValue('description', value)} errors={errors} />
                    </div>
                    <Heading className="mt-10" title="Meta Information" />
                    <div className="mt-6 space-y-6">
                        <Checkbox id="isResponsive" label={<>Is Responsive?</>} disabled={isSubmitting} register={register} errors={errors} />
                        <List id="subCategories" label="Sub Categories" disabled={isSubmitting} setValue={setValue} defaultValue={watch('subCategories')} errors={errors} />
                        <List id="toolsStack" label="Tools Stack" disabled={isSubmitting} setValue={setValue} defaultValue={watch('toolsStack')} errors={errors} />
                        <List id="compatibleBrowsers" label="Compatible Browsers" disabled={isSubmitting} setValue={setValue} defaultValue={watch('compatibleBrowsers')} errors={errors} />
                        <Input id="livePreviewUrl" label="Live Preview URL" disabled={isSubmitting} register={register} errors={errors} />
                    </div>
                    <Heading className="mt-10" title="Images & Source Code" />
                    <div className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FileInput
                                title="Upload Main Image"
                                description="Upload single JPEG, JPG, or PNG file. Other formats are not supported."
                                acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
                                bucketName="products_main_images"
                                onSuccessfullUploadCallback={(url: string) => setValue('mainImageUrl', url)}
                                id="mainImageUrl"
                                label="Main Image URL"
                                note="For better result, upload high resolution image."
                                defaultValue={watch('mainImageUrl')}
                                disabled={isSubmitting}
                                icon={FiImage}
                                buttonLabel="Upload Image"
                                setValue={setValue}
                                errors={errors}
                            />
                            <FileInput
                                title="Upload Source Code"
                                description="Upload single ZIP file. Other formats are not supported."
                                acceptedTypes={['application/zip']}
                                bucketName="products_source_code"
                                onSuccessfullUploadCallback={(url: string) => setValue('sourceCodeUrl', url)}
                                id="sourceCodeUrl"
                                label="Source Code URL"
                                note="Upload source code file in zip format."
                                defaultValue={watch('sourceCodeUrl')}
                                disabled={isSubmitting}
                                icon={RiFolderZipLine}
                                buttonLabel="Upload Source Code"
                                setValue={setValue}
                                errors={errors}
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <label className="text-sm text-charcoal font-medium" htmlFor="otherImagesUrls">Other Images</label>
                            <span className="text-sm text-gray-400">For better result, upload high resolution images.</span>

                            {watch('otherImagesUrls').length !== 3 && (
                                <button className="mt-4 w-fit flex items-center gap-x-2 py-2 px-4 rounded-md border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-all font-medium text-gray-700" type="button" disabled={isSubmitting} onClick={() => {
                                    setIsOpen(true)
                                    setTitle('Upload Other Image')
                                    setDescription('Upload single JPEG, JPG, PNG, or ZIP file. Other formats are not supported.')
                                    setAcceptedTypes(['image/jpeg', 'image/jpg', 'image/png'])
                                    setBucketName('products_other_images')
                                    setOnSuccessfullUploadCallback((url: string) => setValue('otherImagesUrls', [...watch('otherImagesUrls'), url]))
                                }}>
                                    <FiImage className="w-5 h-5" />
                                    <span className="text-sm">Upload Image</span>
                                </button>
                            )}

                            {watch('otherImagesUrls').length !== 0 && (
                                <>
                                    <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                        {watch('otherImagesUrls').map((url: string, index: number) => (

                                            <div key={index} className="w-full max-w-[20rem] relative">

                                                {url.split('.').pop() === 'jpg' || url.split('.').pop() === 'jpeg' || url.split('.').pop() === 'png' ? (
                                                    <img className="w-full max-w-[20rem] aspect-video rounded-md border border-gray-200" src={url} alt="Upload Preview" />
                                                ) : url.split('.').pop() === 'zip' ? (
                                                    <div className="w-full max-w-[20rem] aspect-video rounded-md border border-gray-200 flex justify-center items-center">
                                                        <RiFolderZipLine className="w-10 h-10" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full max-w-[20rem] aspect-video rounded-md border border-gray-200 flex justify-center items-center">
                                                        <FiFile className="w-10 h-10" />
                                                    </div>
                                                )}

                                                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" type="button" disabled={isSubmitting} onClick={() => setValue('otherImagesUrls', watch('otherImagesUrls').filter((_url: string, i: number) => i !== index))} icon={IoMdClose} />
                                            </div>

                                        ))}

                                    </div>
                                </>
                            )}

                            {errors['otherImagesUrls'] && (
                                <span className="text-sm text-red-700">{errors['otherImagesUrls']?.message as string}</span>
                            )}

                        </div>
                        <Button type="submit" disabled={isSubmitting} label={productId === 'add-product' ? 'Add Product' : 'Save Changes'} />
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddOrEditProductPage