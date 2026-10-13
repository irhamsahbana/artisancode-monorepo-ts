import { z } from "zod";

export const uomSchema = z.object({
  name: z.string().min(1, "Nama satuan wajib diisi"),
  symbol: z.string().min(1, "Simbol wajib diisi"),
  category: z.enum([
    "length",
    "area",
    "volume",
    "mass",
    "time",
    "quantity",
    "other",
  ]),
});

export type UomFormValues = z.infer<typeof uomSchema>;

export const defaultUomValues: UomFormValues = {
  name: "",
  symbol: "",
  category: "other",
};
