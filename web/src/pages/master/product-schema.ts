import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const defaultProductValues: ProductFormValues = {
  name: "",
  unit: "",
};
