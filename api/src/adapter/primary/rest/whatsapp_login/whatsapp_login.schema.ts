import { z } from 'zod'

export const requestWhatsAppLoginSchema = z.object({
  phone: z.string().min(6).max(20),
})
