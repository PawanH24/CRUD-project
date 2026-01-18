import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Product name is requied"),
  price: z.number().positive("Price must be entered"),
  image: z.string().min(1, "Image URL is required"),
});

export type StationaryFormData = z.infer<typeof productSchema>;
