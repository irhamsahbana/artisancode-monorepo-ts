import { z } from 'zod'

export const getWebhookLogListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  invoiceNumber: z.string().optional(),
})
