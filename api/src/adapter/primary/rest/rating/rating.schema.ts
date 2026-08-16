import { z } from 'zod'

import { RiskLevels } from '@/entities/rating.entity'

export const createCustomerRatingSchema = z.object({
  customerId: z.uuid(),
  contactId: z.uuid().optional(),
  ratingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  paymentScore: z.number().int().min(1).max(5),
  relationshipScore: z.number().int().min(1).max(5),
  problemNotes: z.string().optional(),
  riskLevel: z.enum(RiskLevels as [string, ...string[]]),
  notes: z.string().optional(),
})

export const getCustomerRatingListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  customerId: z.uuid().optional(),
  contactId: z.uuid().optional(),
})
