import {z} from "zod";

const productFormSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  stone_type: z.string().trim().min(1, "Stone type is required"),
  color: z.string().trim().min(1, "Color is required"),
  shape: z.string().trim().min(1, "Shape is required"),
  origin: z.string().trim().nullable().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discounted_price: z.coerce.number().min(0, "Discounted price cannot be negative").optional(),
  stock_quantity: z.coerce.number().int("Stockquantity must be a whole number").min(0, "Stock quantity cannot be negative"),
  is_featured: z.boolean(),
  description: z.string().optional(),
}).refine(
  (data) => 
    data.discounted_price === undefined || data.discounted_price <= data.price,
  {
    message: "Discounted price cannot be greater than the original price",
    path: ["discounted_price"]
  }
)

export type ProductFormSchema = z.infer<typeof productFormSchema>
export default productFormSchema;