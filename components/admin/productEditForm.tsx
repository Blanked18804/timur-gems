"use client"

import { ProductWithImages } from "@/sharedTableTypes"
import productEditFormSchema, { ProductEditFormSchema } from "@/utils/validations/admin/productEditForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProductEditForm({product}: {product: ProductWithImages}) {
    const form = useForm<ProductEditFormSchema>({
        resolver: zodResolver(productEditFormSchema),
        defaultValues: {
            name: product.name,
            stone_type: product.stone_type,
            color: product.color,
            price: product.price,
            discount_price: product.discount_price ?? undefined,
            stock_quantity: product.stock_quantity,
            description: product.description ?? "",
        }
    });

    console.log("hello from edit page");
    console.log(product);

  return (
    <section>
        howdie
    </section>
  )
}

