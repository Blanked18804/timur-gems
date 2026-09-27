export interface Product {
  id: string;

  name: string;
  description: string | null;

  // Gemstone information
  stone_type: string;
  shape: string;
  color: string;
  weight: number | null; // carats

  // Gemstone characteristics
  origin: string | null;

  // Pricing
  price: number;
  discount_price: number | null;

  // Inventory
  stock_quantity: number;
  is_available: boolean;

  // Storefront
  is_featured: boolean;

  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;

  image_url: string;
  alt_text: string | null;

  sort_order: number;
  is_primary: boolean;

  created_at: string;
}

export interface ProductWithImages extends Product{
    product_images: ProductImage[];
}