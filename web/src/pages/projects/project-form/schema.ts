import { z } from "zod";

export const schema = z.object({
  projectNumber: z.string().optional(),
  name: z.string().min(1, "Nama proyek wajib diisi"),
  customerId: z.string().min(1, "Pelanggan wajib dipilih"),
  contactId: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  sourceOfFunds: z.string().optional(),
  picName: z.string().optional(),
  status: z.enum(["prospect", "in_progress", "won", "lost"]),
  estimatedValue: z.string().optional(),
  spkNumber: z.string().optional(),
  lostReason: z.string().optional(),
  winnerCompetitor: z.string().optional(),
  products: z.array(z.object({ productId: z.string(), quantity: z.number() })),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;

export const emptyValues: FormValues = {
  projectNumber: "",
  name: "",
  customerId: "",
  contactId: "",
  location: "",
  latitude: undefined,
  longitude: undefined,
  sourceOfFunds: "",
  picName: "",
  status: "prospect",
  estimatedValue: "",
  spkNumber: "",
  lostReason: "",
  winnerCompetitor: "",
  products: [],
  notes: "",
};
