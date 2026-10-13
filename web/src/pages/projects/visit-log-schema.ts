import { z } from "zod";

export const visitSchema = z.object({
  visitDate: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  metWith: z.string().optional(),
  topic: z.string().optional(),
  notes: z.string().optional(),
});

export type VisitFormValues = z.infer<typeof visitSchema>;

export const emptyVisitValues: VisitFormValues = {
  visitDate: "",
  metWith: "",
  topic: "",
  notes: "",
};
