"use server";

import { ProductWithImages } from "@/sharedTableTypes";
import { createClient } from "../supabase/server";
import productFormSchema from "../validations/admin/productForm";

// returns all products info
export async function fetchProducts(
  option: FetchProductsOptions = {},
): Promise<ProductWithImages[]> {
  const supabase = await createClient();

  let query = supabase.from("products").select(`*, product_images (*), stone_types (id, name), shapes (id, name), colors(id, name)`);

  if (option.is_featured !== undefined) {
    query = query.eq("is_featured", option.is_featured);
  }
  if (option.stone_type) {
    query = query.eq("stone_type_id", option.stone_type);
  }
  if (option.color) {
    query = query.eq("color_id", option.color);
  }
  if (option.shape) {
    query = query.eq("shape_id", option.shape);
  }
//   if (option.is_available !== undefined) {
//     query = query.eq("is_available", option.is_available);
//   }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching product:", error);
    return [];
  }

  return products;
}

// returns single product info
export async function fetchProductById(
  id: string,
): Promise<ProductWithImages | null> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`*, product_images (*), stone_types (id, name), shapes (id, name), colors(id, name)`)
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return product;
}
export async function addProduct(formData: FormData) {
  const supabase = await createClient();

  // Keep track of uploaded files for cleanup if something fails.
  const uploadedPaths: string[] = [];
  let productId: string | null = null;

  try {
    // 1. Parse and validate product data.
    const rawProduct = formData.get("product");

    if (typeof rawProduct !== "string") {
      throw new Error("Product data is missing.");
    }

    let parsedProduct: unknown;

    try {
      parsedProduct = JSON.parse(rawProduct);
    } catch {
      throw new Error("Invalid product data.");
    }

    const validation = productFormSchema.safeParse(parsedProduct);

    if (!validation.success) {
      throw new Error(
        validation.error.issues.map((issue) => issue.message).join(", "),
      );
    }

    const productData = validation.data;

    // 2. Parse image metadata.
    const rawMetadata = formData.get("imageMetadata");

    if (typeof rawMetadata !== "string") {
      throw new Error("Image metadata is missing.");
    }

    let imageMetadata: ImageMetadata[];

    try {
      imageMetadata = JSON.parse(rawMetadata);
    } catch {
      throw new Error("Invalid image metadata.");
    }

    if (!Array.isArray(imageMetadata)) {
      throw new Error("Invalid image metadata.");
    }

    // 3. Read and validate image files.
    const rawImages = formData.getAll("images");

    if (rawImages.some((image) => !(image instanceof File))) {
      throw new Error("Invalid image file.");
    }

    const images = rawImages as File[];

    if (images.length > 4) {
      throw new Error("You can upload a maximum of 4 images.");
    }

    if (images.length !== imageMetadata.length) {
      throw new Error("Image files and metadata do not match.");
    }

    if (
      imageMetadata.some(
        (metadata) =>
          typeof metadata.alt_text !== "string" ||
          !Number.isInteger(metadata.sort_order) ||
          metadata.sort_order < 0 ||
          typeof metadata.is_primary !== "boolean",
      )
    ) {
      throw new Error("Invalid image metadata.");
    }

    if (
      images.length > 0 &&
      imageMetadata.filter((image) => image.is_primary).length !== 1
    ) {
      throw new Error("Exactly one image must be selected as primary.");
    }

    // 4. Upload images first.
    const productImages = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const metadata = imageMetadata[i];

      if (!image.type.startsWith("image/")) {
        throw new Error(`${image.name} is not a valid image.`);
      }

      if (image.size === 0) {
        throw new Error(`${image.name} is empty.`);
      }

      const safeFileName = image.name.replace(/[^a-zA-Z0-9._-]/g, "_");

      const filePath = `${crypto.randomUUID()}-${safeFileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, image);

      if (error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }

      // Track each successful upload for rollback.
      uploadedPaths.push(data.path);

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      productImages.push({
        image_url: publicUrlData.publicUrl,
        alt_text: metadata.alt_text,
        sort_order: metadata.sort_order,
        is_primary: metadata.is_primary,
      });
    }

    // 5. All images uploaded. Insert the product.
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (productError) {
      throw new Error(`Product creation failed: ${productError.message}`);
    }

    productId = product.id;

    // 6. Insert all product image records together.
    if (productImages.length > 0) {
      const imageRows = productImages.map((image) => ({
        ...image,
        product_id: product.id,
      }));

      const { error: imageError } = await supabase.from("product_images").insert(imageRows);

      if (imageError) {
        throw new Error(`Saving product images failed: ${imageError.message}`);
      }
    }

    // 7. Everything succeeded.
    return product;
  } catch (error) {
    console.error("addProduct error:", error);

    // Delete the product if it was already inserted.
    // Its product_images records are deleted through ON DELETE CASCADE.
    if (productId) {
      const { error: deleteError } = await supabase.from("products").delete().eq("id", productId);

      if (deleteError) {
        console.error("Product rollback failed:", deleteError);
      }
    }

    // Delete any images uploaded before the failure.
    if (uploadedPaths.length > 0) {
      const { error: cleanupError } = await supabase.storage.from("product-images").remove(uploadedPaths);

      if (cleanupError) {
        console.error("Image cleanup failed:", cleanupError);
      }
    }

    throw new Error(
      error instanceof Error ? error.message : "Failed to add product.",
    );
  }
}
