import { z } from "zod";

const productLineSchema = z.object({
  productId: z.string().optional(),
  specification: z.string().optional(),
  quantity: z.string().optional(),
  unit: z.string().optional(),
});

export const schema = z.object({
  title: z.string().min(1, "Judul penawaran wajib diisi"),
  topic: z.string().optional(),
  projectId: z.string().optional(),
  requesterName: z.string().min(1, "Nama wajib diisi"),
  companyName: z.string().optional(),
  whatsapp: z.string().min(1, "WhatsApp wajib diisi"),
  email: z.email("Email tidak valid").optional().or(z.literal("")),
  notes: z.string().optional(),
  productLines: z.array(productLineSchema),
});

export type FormValues = z.infer<typeof schema>;
export type ProductLineValues = z.infer<typeof productLineSchema>;

export function newLine(): ProductLineValues {
  return { productId: "", specification: "", quantity: "", unit: "" };
}

export const emptyValues: FormValues = {
  title: "",
  topic: "",
  projectId: "",
  requesterName: "",
  companyName: "",
  whatsapp: "",
  email: "",
  notes: "",
  productLines: [newLine()],
};
