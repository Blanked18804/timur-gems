"use server"

import { ProductWithImages } from "@/sharedTableTypes";
import { createClient } from "../supabase/server";
import { file } from "zod";
import { metadata } from "@/app/layout";

// returns all products info
export async function fetchProducts(option: FetchProductsOptions = {}
): Promise<ProductWithImages[]> {
    const supabase = await createClient();

    // query acts as sql equivalnet of SELECT products.*, product_images.* FROM products LEFT JOIN product_images ON product_images.product_id = products.id;
    let query = supabase
        .from("products")
        .select(`*, product_images (*)`);

    if (option.is_featured !== undefined) {
        query = query.eq("is_featured", option.is_featured)
    }
    if (option.stone_type) {
        query = query.eq("stone_type", option.stone_type)
    }
    if (option.color) {
        query = query.eq("color", option.color)
    }
    if (option.shape) {
        query = query.eq("shape", option.shape)
    }
    if (option.is_available !== undefined) {
        query = query.eq("is_available", option.is_available)
    }

    const { data: products, error } = await query;

    if (error) {
        console.log(error);
        return [];
    }

    return products;
}

// returns single product info
export async function fetchProductById(id: string): Promise<ProductWithImages | null> {
    const supabase = await createClient();

    const { data: product, error } = await supabase.from("products").select(`*, product_images (*)`).eq("id", id).single();

    if (error) {
        console.log(error);
        return null;
    }

    return product;
}

export async function addProduct(formData: FormData) {
    const productData = JSON.parse(formData.get("product") as string);
    const images = formData.getAll("images") as File[];
    const imageMetadata = JSON.parse(formData.get("imageMetadata") as string) as {
        alt_text: string;
        sort_order: string;
        is_primary: boolean;
    }[];

    console.log(productData);

    const supabase = await createClient();

    const { data: product, error } = await supabase.from("products").insert(productData).select().single();

    if (error) {
        console.error("Product insert error: ", error);
        throw new Error(error.message);
    }

    console.log("product created: ", product)

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const metadata = imageMetadata[i];

        const filepath = `${crypto.randomUUID()}-${image.name}`;

        const { data, error } = await supabase.storage.from("product-images").upload(filepath, image);

        if (error) {
            console.error("Image upload error: ", error);
            throw new Error(error.message);
        }

        console.log("image added to bucket: ", data);

        const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(data.path);

        const { error: imageError } = await supabase.from("product_images").insert({
            product_id: product.id,
            image_url: publicUrlData.publicUrl,
            alt_text: metadata.alt_text,
            sort_order: metadata.sort_order,
            is_primary: metadata.is_primary,
        });

        if (imageError) {
            console.error("Failed to save image information:", imageError);
            throw new Error("Failed to save image information");
        }

        console.log("image added to the product_images table")
    }

    console.log("created product", product);

    return product;

}