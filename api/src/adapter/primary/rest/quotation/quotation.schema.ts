import { z } from 'zod'

import { QuotationStatuses } from '@/entities/quotation.entity'

export const createQuotationSchema = z.object({
  title: z.string().max(255).optional(),
  projectId: z.uuid().optional(),
  topic: z.string().optional(),
  requesterName: z.string().min(1).max(255),
  companyName: z.string().optional(),
  whatsapp: z.string().min(5).max(30),
  email: z.email().optional(),
  products: z
    .array(
      z.object({
        productName: z.string().min(1).max(255),
        specification: z.string().optional(),
        quantity: z.string().optional(),
      }),
    )
    .optional(),
  notes: z.string().optional(),
})

export const updateQuotationStatusSchema = z.object({
  status: z.enum(QuotationStatuses as [string, ...string[]]),
})

export const assignQuotationSchema = z.object({
  projectId: z.uuid(),
})

export const getQuotationListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  status: z.enum(QuotationStatuses as [string, ...string[]]).optional(),
})
