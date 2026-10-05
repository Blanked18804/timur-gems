"use client"

import { addProduct } from '@/utils/actions/products.action';
import productFormSchema, { ProductFormSchema } from '@/utils/validations/admin/productForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ProductForm() {
    const form = useForm<ProductFormSchema>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            stone_type: "",
            shape: "",
            color: "",
            origin: "",
            price: 0,
            discounted_price: 0,
            stock_quantity: 0,
            is_featured: false,
            description: "",
        }
    });

    const [images, setImages] = useState<ProductImageInput[]>([]);
    const [selectImageError, setSelectImageError] = useState("");
    const maxImages = 4;

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (images.length + files.length > maxImages) {
            setSelectImageError(`You can upload maximum of ${maxImages} images`)
            return;
        }

        console.log((files))

        const newImages: ProductImageInput[] = files.map((file, index) => {
            return (
                {
                    file,
                    preview: URL.createObjectURL(file),
                    alt_text: "",
                    sort_order: images.length + index,
                    is_primary: images.length === 0 && index === 0, // if no existing images then makes it primary
                }
            )
        })

        setSelectImageError("");

        setImages((currentimages) => [
            ...currentimages,
            ...newImages,
        ]);

        // event.target.value = "";
    }

    const handleRemoveImage = (index: number) => {
        setImages((currentImages) => {
            const imageToRemove = currentImages[index];

            // Free the temporary preview URL
            URL.revokeObjectURL(imageToRemove.preview);

            const remainingImages = currentImages
                .filter((_, imageIndex) => imageIndex !== index)
                .map((image, newIndex) => ({
                    ...image,
                    sort_order: newIndex,
                }));

            // If the removed image was primary then make the first remaining image primary.
            if (imageToRemove.is_primary && remainingImages.length > 0) {
                remainingImages[0].is_primary = true;
            }
            return remainingImages;
        });

        setSelectImageError("");
    };

    const handleAltTextChange = (index: number, altText: string) => {
        setImages((currentImages) =>
            currentImages.map((image, imageIndex) =>
                imageIndex === index
                    ? { ...image, alt_text: altText }
                    : image
            )
        );
    };

    const handlePrimaryChange = (index: number) => {
        setImages((currentImages) =>
            currentImages.map((image, imageIndex) => ({
                ...image,
                is_primary: imageIndex === index,
            }))
        );
    };

    const handleSubmit = async (data: ProductFormSchema) => {
        const formData = new FormData();

        formData.append("product", JSON.stringify(data));

        images.forEach((image) => {
            formData.append("images", image.file);
        });

        formData.append("imageMetadata", JSON.stringify(images.map((image) => ({
            alt_text: image.alt_text,
            sort_order: image.sort_order,
            is_primary: image.is_primary,
        }))))

        await addProduct(formData);
    }

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-16 w-full">
            {/* for images */}
            <div className="flex flex-col gap-8">
                <h2 className='text-2xl font-semibold'>Product Images</h2>

                <div className='grid grid-cols-2 gap-4'>
                    {images.map((image, index) => (
                        <div key={image.preview} className="flex flex-col gap-4">
                            <h3 className='text-xl font-semibold'>Image {index + 1}</h3>

                            <div className='w-full relative'>
                                <img src={image.preview} alt={image.alt_text} className="w-full h-64 object-cover" />
                                <button type="button" onClick={() => handleRemoveImage(index)} className='absolute top-2 right-2 p-2 bg-white rounded-full border hover:text-red-500'><Trash size={18} /></button>
                            </div>

                            <div className="flex flex-col gap-4 mb-8">
                                <div className='flex flex-col gap-2'>
                                    <label >Alt Text</label>
                                    <input type="text" placeholder="Enter alt text" value={image.alt_text} onChange={(event) => handleAltTextChange(index, event.target.value)} />
                                </div>

                                <div className='flex w-full gap-2'>

                                    <div className='flex flex-col gap-2 w-full'>
                                        <label >Sort Order</label>
                                        <input type="number" value={image.sort_order} />
                                    </div>

                                </div>

                                <div className='flex  items gap-2'>
                                    <label>Primary image</label>
                                    <input type="radio" checked={image.is_primary} name='primary-image' onChange={() => handlePrimaryChange((index))} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {images.length < maxImages && (
                        // <input type='file' accept='image/*' multiple onChange={handleImageSelect} className='h-64' />
                        <div className='flex flex-col gap-4'>
                            <h3 className='text-xl font-semibold'>Add {images.length + 1} / {maxImages} Image</h3>
                            <label className='h-64 border-2 bg-white/50 border-border border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gold/10 transition'>
                                <span className='text-lg font-semibold'>Add Images</span>
                                <span className='text-sm text-gray-500 mt-2'>Click to select images</span>
                                <span className='text-xs text-gray-400 mt-1'>Select images up to {maxImages - images.length}</span>
                                <input type="file" accept='image/*' multiple onChange={handleImageSelect} className='hidden' />
                            </label>

                            {
                                selectImageError && (
                                    <p className='text-sm text-red-500 '>{selectImageError}</p>
                                )
                            }
                        </div>
                    )}
                </div>

            </div>

            {/* for product info */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Product Detail</h2>

                <div className="min-w-0 w-full flex flex-col gap-4">

                    <div className="flex gap-8 w-full">

                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Name</label>
                            <input type="text" placeholder='Enter product name' {...form.register("name")} />

                            {form.formState.errors.name && (
                                <p className='text-sm text-red-500'>{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        {/* when stone type are made into tags then convert it into options */}
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Stone Type</label>
                            <input type="text" {...form.register("stone_type")} />

                            {form.formState.errors.stone_type && (
                                <p className='text-sm text-red-500'>{form.formState.errors.stone_type.message}</p>
                            )}
                        </div>

                    </div>

                    <div className="flex gap-8 w-full">
                        {/* when shapes are made into tags then convert it into options */}
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Shape</label>
                            <input type="text" {...form.register("shape")} />

                            {form.formState.errors.shape && (
                                <p className='text-sm text-red-500'>{form.formState.errors.shape.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Color</label>
                            <input type="text" {...form.register("color")} />

                            {form.formState.errors.color && (
                                <p className='text-sm text-red-500'>{form.formState.errors.color.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-8 w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Origin</label>
                            <input type="text" placeholder="Enter product's origin" {...form.register("origin")} />

                            {form.formState.errors.origin && (
                                <p className='text-sm text-red-500'>{form.formState.errors.origin.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Price</label>
                            <input type="number" {...form.register("price")} />

                            {form.formState.errors.price && (
                                <p className='text-sm text-red-500'>{form.formState.errors.price.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-8 w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Discounted Price</label>
                            <input type="number" {...form.register("discounted_price")} />

                            {form.formState.errors.discounted_price && (
                                <p className='text-sm text-red-500'>{form.formState.errors.discounted_price.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="font-semibold">Stock Quantity</label>
                            <input type="number" {...form.register("stock_quantity")} />

                            {form.formState.errors.stock_quantity && (
                                <p className='text-sm text-red-500'>{form.formState.errors.stock_quantity.message}</p>
                            )}
                        </div>
                    </div>

                    {/* make it option of either true or false */}
                    <div className="flex flex-col gap-2 w-1/2">
                        <label className="font-semibold">Is Featured</label>
                        {/* <input type="text" {...form.register("is_featured")} /> */}
                        <input type="radio" {...form.register("is_featured")} />
                        {form.formState.errors.is_featured && (
                            <p className='text-sm text-red-500'>{form.formState.errors.is_featured.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold">Description</label>
                        <textarea {...form.register("description")} rows={6} className="resize-y" />

                        {form.formState.errors.description && (
                            <p className='text-sm text-red-500'>{form.formState.errors.description.message}</p>
                        )}
                    </div>

                    <div className='flex gap-2 ml-auto'>
                        <button type='button' className='btn-secondary'>Cancel</button>
                        <button type='submit' className='btn'>Add Product</button>
                    </div>
                </div>
            </div>
        </form>
    )
}
