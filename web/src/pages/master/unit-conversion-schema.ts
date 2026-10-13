import { z } from "zod";

export const unitConversionSchema = z
  .object({
    category: z.string().min(1, "Tipe satuan wajib dipilih"),
    fromUnitId: z.string().min(1, "Satuan asal wajib dipilih"),
    toUnitId: z.string().min(1, "Satuan tujuan wajib dipilih"),
    factor: z
      .string()
      .refine((v) => v.trim() !== "" && !Number.isNaN(Number(v)), {
        message: "Faktor wajib diisi dengan angka",
      }),
  })
  .refine((data) => data.fromUnitId !== data.toUnitId, {
    message: "Satuan asal dan satuan tujuan tidak boleh sama",
    path: ["toUnitId"],
  });

export type UnitConversionFormValues = z.infer<typeof unitConversionSchema>;

export const defaultUnitConversionValues: UnitConversionFormValues = {
  category: "",
  fromUnitId: "",
  toUnitId: "",
  factor: "",
};
