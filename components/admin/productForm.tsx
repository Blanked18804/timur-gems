"use client"

import productFormSchema, { ProductFormSchema } from '@/utils/validations/admin/productForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function ProductForm() {
    const form = useForm<ProductFormSchema>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            stone_type: "",
            color: "",
            price: 0,
            shape: "",
            origin: "",
            discounted_price: 0,
            stock_quantity: 0,
            description: "",
            isFeatured: false,
        }
    });

    return (
        <form action="" className="grid grid-cols-2 gap-16 w-full">
            {/* for images */}
            <div className="flex flex-col gap-4">

            </div>
            {/* for product info */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Product Images</h2>
                <div className="min-w-0 w-full flex flex-col gap-4">
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Name</label>
                            <input type="text" {...form.register("name")} />
                        </div>

                        {/* when stone type are made into tags then convert it into options */}
                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Stone Type</label>
                            <input type="text" {...form.register("stone_type")} />
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {/* when shapes are made into tags then convert it into options */}
                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Shape</label>
                            <input type="text" {...form.register("shape")} />
                        </div>

                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Color</label>
                            <input type="text" {...form.register("color")} />
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Origin</label>
                            <input type="text" {...form.register("origin")} />
                        </div>

                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Price</label>
                            <input type="number" {...form.register("price")} />
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Discounted Price</label>
                            <input type="number" {...form.register("discounted_price")} />
                        </div>

                        <div className="flex flex-col gap-2 max-w-64">
                            <label className="font-semibold">Stock Quantity</label>
                            <input type="number" {...form.register("stock_quantity")} />
                        </div>
                    </div>

                    {/* make it option of either true or false */}
                    <div className="flex flex-col gap-2 max-w-64">
                        <label className="font-semibold">Is Featured</label>
                        <input type="text" {...form.register("shape")} />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label className="font-semibold">Description</label>
                        <textarea {...form.register("description")} rows={5} className="resize-y max-w-lg" />
                    </div>
                </div>
            </div>
        </form>
    )
}
