import { useState } from 'react'

import cn from '@/utils/cn'

interface ImageDisplayerProps {
    className?: string,
    images: { imageSrc: string, imageAlt: string }[],
}

const ImageDisplayer: React.FC<ImageDisplayerProps> = ({
    className,
    images,
}) => {
    const [currentDisplayImage, setCurrentDisplayImage] = useState<{ imageSrc: string, imageAlt: string }>(images[0] || { imageSrc: '', imageAlt: '' })

    return (
        <div className={cn(className)}>
            <img className="w-full aspect-video object-cover bg-white rounded-md shadow border border-gray-200 shadow-gray-200" src={currentDisplayImage.imageSrc} alt={currentDisplayImage.imageAlt} />
            <div className="mt-2 grid grid-cols-4 gap-x-2">

                {images.map((image, index) => (
                    <img key={index} className={cn('w-full aspect-video bg-white shadow shadow-gray-200 rounded-md border border-gray-200 cursor-pointer hover:ring-2 ring-gray-700 hover:scale-105 transform-gpu transition-all', image.imageSrc === currentDisplayImage.imageSrc && 'scale-105 ring-2')} src={image.imageSrc} alt={image.imageAlt} onClick={() => setCurrentDisplayImage({ imageSrc: image.imageSrc, imageAlt: image.imageAlt })} />
                ))}

            </div>
        </div>
    )
}

export default ImageDisplayer