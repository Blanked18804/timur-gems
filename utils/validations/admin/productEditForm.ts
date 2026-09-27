import {z} from "zod";

const productEditFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  stone_type: z.string().min(1, "Stone type is required"),
  color: z.string().min(1, "Color is required"),
  price: z.number().positive("Price must be greater than 0"),
  discount_price: z.number().min(0).optional(),
  stock_quantity: z.number().int().min(0),
  description: z.string().optional(),
});

export type ProductEditFormSchema = z.infer<typeof productEditFormSchema>
export default productEditFormSchema;