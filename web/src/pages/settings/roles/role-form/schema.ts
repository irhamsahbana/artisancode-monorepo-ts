import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Nama role wajib diisi"),
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;

export const emptyValues: FormValues = {
  name: "",
  description: "",
};
