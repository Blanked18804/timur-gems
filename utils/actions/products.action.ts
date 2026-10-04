"use server"

import { ProductWithImages } from "@/sharedTableTypes";
import { createClient } from "../supabase/server";

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

    console.log(productData);
}