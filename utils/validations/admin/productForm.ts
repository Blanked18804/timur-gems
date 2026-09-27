import {z} from "zod";

const productDescriptionFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  stone_type: z.string().min(1, "Stone type is required"),
  color: z.string().min(1, "Color is required"),
  price: z.number().positive("Price must be greater than 0"),
  discount_price: z.number().min(0).optional(),
  stock_quantity: z.number().int().min(0),
  description: z.string().optional(),
});

const productImagesInfoFormSchema = z.object({
  alt_text: z.string().min(1, "Alt text is required"),
  sort_order: z.number().positive().min(0).max(5),
})

export type ProductDescriptionFormSchema = z.infer<typeof productDescriptionFormSchema>
export default productDescriptionFormSchema;