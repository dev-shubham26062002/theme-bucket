import * as z from 'zod'

export const becomeASellerSchema = z.object({
    termsAndConditions: z.boolean().refine((value) => value === true)
})

export const addOrEditProductSchema = z.object({
    name: z.string().nonempty({
        message: 'Name cannot be empty.',
    }).refine((value) => !/^\s*$/.test(value), {
        message: 'Name cannot be empty.',
    }),
    price: z.string().nonempty({
        message: 'Price cannot be empty.',
    }).refine((value) => value.charAt(0) !== '0', {
        message: 'Price cannot start with 0.',
    }).refine((value) => value.charAt(0) !== '+', {
        message: 'Price cannot start with +.',
    }).refine((value) => /^[+]?\d*\.?\d+$/.test(value), {
        message: 'Price must be positive numeric value.',
    }),
    mainCategory: z.string().nonempty({
        message: 'Main category cannot be empty.',
    }),
    description: z.string(),
    isResponsive: z.boolean(),
    subCategories: z.array(z.string()),
    toolsStack: z.array(z.string()),
    compatibleBrowsers: z.array(z.string()),
    livePreviewUrl: z.string(),
    mainImageUrl: z.string().nonempty({
        message: 'Main image URL cannot be empty.',
    }),
    sourceCodeUrl: z.string().nonempty({
        message: 'Source code URL cannot be empty.',
    }),
    otherImagesUrls: z.array(z.string()).min(3, {
        message: 'You must provide 3 images.',
    }).max(3, {
        message: 'You must provide 3 images.',
    }),
})

export const sellerProductsSearchSchema = z.object({
    query: z.string(),
})

export const addCategorySchema = z.object({
    name: z.string().nonempty({
        message: 'Name cannot be empty.',
    }).refine((value) => !/^\s*$/.test(value), {
        message: 'Name cannot be empty.',
    }),
    imageUrl: z.string().nonempty({
        message: 'Image URL cannot be empty.',
    }),
})

export const addReviewSchema = z.object({
    rating: z.number().min(0).max(5),
    message: z.string().max(150).nonempty({
        message: 'Review message cannot be empty.',
    }).refine((value) => !/^\s*$/.test(value), {
        message: 'Review message cannot be empty.',
    }),
})

export const avatarSchema = z.object({
    avatarUrl: z.string().nonempty({
        message: 'Avatar URL cannot be empty.',
    }),
})

export const profileSchema = z.object({
    name: z.string().nonempty({
        message: 'Name cannot be empty.',
    }).refine((value) => !/^\s*$/.test(value), {
        message: 'Name cannot be empty.',
    }),
    country: z.string(),
    city: z.string(),
})