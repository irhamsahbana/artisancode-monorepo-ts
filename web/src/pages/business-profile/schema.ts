import { DEFAULT_COUNTRY_CODE } from "@artisancode/phone";
import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Nama perusahaan wajib diisi"),
  phone: z.string().min(1, "No. telepon wajib diisi"),
  countryCode: z.string().min(1, "Kode negara wajib dipilih"),
  email: z.email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;

export const emptyValues: FormValues = {
  name: "",
  phone: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  email: "",
  address: "",
};
