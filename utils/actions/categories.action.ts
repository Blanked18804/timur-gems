"use server"

import { ProductCategory } from "@/sharedTableTypes";
import { createClient } from "../supabase/server";

export async function getCategories(categoryName: "stone_types" | "shapes" | "colors"): Promise<ProductCategory[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from(categoryName).select("*").order("name");

    if (error) {
        throw new Error(error.message);
    }

    return data;
}