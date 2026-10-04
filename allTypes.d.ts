// for filtering products
interface FetchProductsOptions {
    is_featured?: boolean;
    stone_type?: string;
    color?: string;
    shape?: string;
    is_available?: boolean;
}

// for new images for products
interface ProductImageInput {
    file: File;
    preview: string;
    alt_text: string;
    sort_order: number;
    is_primary: boolean;
};