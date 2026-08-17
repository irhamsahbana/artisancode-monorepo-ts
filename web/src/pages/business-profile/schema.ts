import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Nama perusahaan wajib diisi"),
  phone: z.string().min(1, "No. telepon wajib diisi"),
  email: z.email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;

export const initialValues: FormValues = {
  name: "CV Wika Sejahtera",
  phone: "628001234567",
  email: "info@wika.co.id",
  address: "Jl. Merdeka No. 10, Jakarta Selatan",
};
