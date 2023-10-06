import { create } from 'zustand'

interface useStoreFileUploadModal {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    title: string,
    setTitle: (title: string) => void,
    description: string,
    setDescription: (description: string) => void,
    acceptedTypes: string[],
    setAcceptedTypes: (acceptedTypes: string[]) => void,
    file: File | null,
    setFile: (file: File | null) => void,
    error: string | null,
    setError: (error: string | null) => void,
    isUploading: boolean,
    setIsUploading: (isUploading: boolean) => void,
    bucketName: 'products_main_images' | 'products_other_images' | 'products_source_code' | 'categories_images' | 'avatars' | '',
    setBucketName: (bucketName: 'products_main_images' | 'products_other_images' | 'products_source_code' | 'categories_images' | 'avatars' | '') => void,
    onSuccessfullUploadCallback: (url: string) => void,
    setOnSuccessfullUploadCallback: (onSuccessfullUploadCallback: (url: string) => void) => void,
}

const useFileUploadModal = create<useStoreFileUploadModal>((set) => ({
    isOpen: false,
    setIsOpen: (value: boolean) => set({ isOpen: value }),
    title: '',
    setTitle: (value: string) => set({ title: value }),
    description: '',
    setDescription: (value: string) => set({ description: value }),
    acceptedTypes: [],
    setAcceptedTypes: (value: string[]) => set({ acceptedTypes: value }),
    file: null,
    setFile: (value: File | null) => set({ file: value }),
    error: null,
    setError: (value: string | null) => set({ error: value }),
    isUploading: false,
    setIsUploading: (value: boolean) => set({ isUploading: value }),
    bucketName: '',
    setBucketName: (value: 'products_main_images' | 'products_other_images' | 'products_source_code' | 'categories_images' | 'avatars' | '') => set({ bucketName: value }),
    // Don't be confused by the default value, it will be overwritten in the component.
    onSuccessfullUploadCallback: () => { },
    setOnSuccessfullUploadCallback: (onSuccessfullUploadCallback: (url: string) => void) => set({ onSuccessfullUploadCallback }),
}))

export default useFileUploadModal