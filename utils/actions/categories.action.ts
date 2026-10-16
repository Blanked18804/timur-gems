"use server"

import { ProductCategory } from "@/sharedTableTypes";
import { createClient } from "../supabase/server";

export async function getCategories(categoryName: CategoryName): Promise<ProductCategory[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from(categoryName).select("*").order("name");

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteCategory(categoryName: CategoryName, id: string){
    const supabase = await createClient();

    const {error} = await supabase.from(categoryName).delete().eq('id', id);

    if (error){
        throw new Error(error.message);
    }
}

export async function deleteMultipleCategories(categoryName: CategoryName, id: string[]) {
    const supabase = await createClient();

    const {error} = await supabase.from(categoryName).delete().in('id', id);

    if (error){
        throw new Error(error.message);
    }
}

export async function updateCategory(categoryName: CategoryName, id: string, name: string){
    const supabase = await createClient();

    const {error} = await supabase.from(categoryName).update({name}).eq('id', id);

    if(error) {
        throw new Error(error.message);
    }
}

export async function updateMultipleCategories(categoryName: CategoryName, updates: {id: string, name: string}[]){
    if (updates.length === 0) return

    const supabase = await createClient();

    if(updates.some(item => !item.id || !item.name.trim())){
        throw new Error("Every category must have an ID and a name.");
    }

    const results = await Promise.all(
        updates.map(({id, name}) => supabase.from(categoryName).update({name: name.trim()}).eq('id', id)
    ));

    const failedUpdate = results.find(result => result.error);

    if(failedUpdate?.error) {
        throw new Error(failedUpdate.error.message);
    }
}