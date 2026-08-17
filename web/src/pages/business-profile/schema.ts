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

export const initialValues: FormValues = {
  name: "CV Wika Sejahtera",
  phone: "8001234567",
  countryCode: DEFAULT_COUNTRY_CODE,
  email: "info@wika.co.id",
  address: "Jl. Merdeka No. 10, Jakarta Selatan",
};
