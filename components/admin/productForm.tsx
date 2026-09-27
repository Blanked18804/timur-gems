"use client"

import { ProductWithImages } from "@/sharedTableTypes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import productDescriptionFormSchema, { ProductDescriptionFormSchema } from "@/utils/validations/admin/productForm"
import Image from "next/image";

export default function ProductForm({ product }: { product: ProductWithImages }) {
    const form = useForm<ProductDescriptionFormSchema>({
        resolver: zodResolver(productDescriptionFormSchema),
        defaultValues: {
            name: product.name,
            stone_type: product.stone_type,
            color: product.color,
            price: product.price,
            discount_price: product.discounted_price ?? undefined,
            stock_quantity: product.stock_quantity,
            description: product.description ?? "",
        }
    });

    console.log("hello from edit page");
    console.log(product);

    return (
        <form action="" className="grid gap-16 grid-cols-[40%_60%]">
            {/* for images */}
            <div className="grid grid-cols-2 gap-4">
                {product.product_images.map((image) => {
                    return (
                        <div key={image.id}>
                            <div className="relative overflow-hidden min-h-64 h-full">
                                <Image src={image.image_url} alt={image.alt_text ?? product.name} fill />
                            </div>
                            <input type="text" placeholder={image.alt_text ?? ""} />
                        </div>
                    )
                })}
            </div>
            {/* for product info */}
            <div className="w-full">
                <div className="flex gap-4">
                    <label className="font-semibold">Name</label>
                    <input type="text" {...form.register("name")}/>
                </div>
            </div>
        </form>
    )
}

