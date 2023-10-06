import { IoMdClose } from 'react-icons/io'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'

import supabase from '@/libs/supabaseClient'
import IconButton from '@/components/general/IconButton'
import { BsStar, BsStarFill } from 'react-icons/bs'
import { addReviewSchema } from '@/utils/formSchema'
import Button from '../general/Button'
import { Session } from '@supabase/supabase-js'

interface AddReviewModalProps {
    setIsAddReviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    reviewId: string,
    rating: number,
    message: string,
    session: Session,
    productId: string,
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
    setIsAddReviewModalOpen,
    reviewId,
    rating,
    message,
    session,
    productId,
}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<z.infer<typeof addReviewSchema> | FieldValues>({
        resolver: zodResolver(addReviewSchema),
        defaultValues: {
            rating: rating || 0,
            message: message || '',
        },
    })

    const navigate = useNavigate()

    const location = useLocation()

    const handleSubmitButtonClick = async (values: z.infer<typeof addReviewSchema> | FieldValues) => {
        try {
            const { error: reviewError } = await supabase.from('reviews').upsert({
                id: reviewId && reviewId,
                rating: values.rating,
                message: values.message,
                user_id: session.user.id,
                product_id: productId,
            })

            if (reviewError) {
                toast.error('Something went wrong, please try again later.')
            } else {
                toast.success('Review added successfully')
                navigate(location.pathname)
                setIsAddReviewModalOpen(false)
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.')
        }
    }

    return (
        <div className="fixed z-40 inset-0 flex justify-center items-center px-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-white rounded-md border border-gray-200 shadow-lg shadow-gray-200 relative">
                <IconButton className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => setIsAddReviewModalOpen(false)} icon={IoMdClose} />
                <h1 className="text-2xl font-semibold text-brown text-center">Add Review</h1>
                <p className="mt-6 text-sm text-charcoal font-medium text-center">If you have already added a review, you're review will be updated with new one.</p>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleSubmitButtonClick)}>
                    <div className="flex justify-center gap-x-0.5">

                        {Array(5).fill(0).map((_, index) => (
                            <div key={index}>

                                {watch('rating') >= index + 1 ? (
                                    <BsStarFill className="cursor-pointer text-yellow-ochre w-8 h-8" onClick={() => setValue('rating', index + 1)} onMouseEnter={() => setValue('rating', index + 1)} onMouseOut={() => setValue('rating', watch('rating'))} />
                                ) : (
                                    <BsStar className="cursor-pointer text-yellow-ochre w-8 h-8" onClick={() => setValue('rating', index + 1)} onMouseEnter={() => setValue('rating', index + 1)} onMouseOut={() => setValue('rating', watch('rating'))} />
                                )}

                            </div>
                        ))}

                    </div>
                    <div>
                        <div className="relative">
                            <textarea className="resize-none w-full h-32 focus:outline-none focus-visible:outline-none rounded-md border border-gray-200 focus:ring-2 ring-yellow-ochre py-2 px-4 text-sm text-gray-700" id="message" placeholder="Write your review here..." disabled={isSubmitting} {...register('message')} onChange={(event) => event.target.value.length > 150 ? setValue('message', watch('message')) : setValue('message', event.target.value)} />
                            <span className="absolute bottom-4 right-4 text-xs text-gray-400">{watch('message').length}/150</span>
                        </div>
                        {errors && errors['message'] && (
                            <span className="text-sm text-red-700">{errors['message']?.message as string}</span>
                        )}
                    </div>
                    <Button type="submit" disabled={isSubmitting} label="Add Review" />
                </form>
            </div>
        </div>
    )
}

export default AddReviewModal