// for filtering products
interface FetchProductsOptions{
    is_featured?: boolean;
    stone_type?: string;
    color?: string;
    shape?: string;
    is_available?: boolean;
}

type ExistingImage = {
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
}

type NewImage = {
    id: string;
    file: File
    preview: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
}