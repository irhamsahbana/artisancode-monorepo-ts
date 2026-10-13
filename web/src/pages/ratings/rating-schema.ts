import { z } from "zod";

export const ratingSchema = z.object({
  customerId: z.string().min(1, "Pelanggan wajib dipilih"),
  ratingDate: z.string().min(1, "Tanggal penilaian wajib diisi"),
  paymentScore: z.string(),
  relationshipScore: z.string(),
  riskLevel: z.enum(["low", "medium", "high"]),
  problemNotes: z.string().optional(),
  notes: z.string().optional(),
});

export type RatingFormValues = z.infer<typeof ratingSchema>;

export const defaultRatingValues: RatingFormValues = {
  customerId: "",
  ratingDate: new Date().toISOString().slice(0, 10),
  paymentScore: "3",
  relationshipScore: "3",
  riskLevel: "low",
  problemNotes: "",
  notes: "",
};
