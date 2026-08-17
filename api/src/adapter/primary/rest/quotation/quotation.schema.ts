import { z } from 'zod'

import { QuotationStatuses } from '@/entities/quotation.entity'

// ponytail: defense-in-depth only — every current renderer of these fields
// is plain JSX text (auto-escaped), so this isn't closing an active XSS hole,
// just blocking `<`/`>` from ever reaching storage in case a future
// HTML-rendering surface (PDF export, email/WA template) forgets to escape.
const NO_HTML_TAGS = /^[^<>]*$/

export const createQuotationSchema = z.object({
  title: z.string().max(255).regex(NO_HTML_TAGS, 'HTML tags are not allowed').optional(),
  projectId: z.uuid().optional(),
  topic: z.string().regex(NO_HTML_TAGS, 'HTML tags are not allowed').optional(),
  requesterName: z.string().min(1).max(255).regex(NO_HTML_TAGS, 'HTML tags are not allowed'),
  companyName: z.string().regex(NO_HTML_TAGS, 'HTML tags are not allowed').optional(),
  whatsapp: z.string().min(5).max(30),
  email: z.email().optional(),
  products: z
    .array(
      z.object({
        productName: z.string().min(1).max(255).regex(NO_HTML_TAGS, 'HTML tags are not allowed'),
        specification: z.string().regex(NO_HTML_TAGS, 'HTML tags are not allowed').optional(),
        quantity: z.string().regex(NO_HTML_TAGS, 'HTML tags are not allowed').optional(),
      }),
    )
    .optional(),
  notes: z.string().regex(NO_HTML_TAGS, 'HTML tags are not allowed').optional(),
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
