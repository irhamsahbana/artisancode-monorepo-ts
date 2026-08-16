import { z } from 'zod'

import { BroadcastOccasions } from '@/entities/broadcast.entity'

export const createBroadcastTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  message: z.string().min(1),
  occasion: z.enum(BroadcastOccasions as [string, ...string[]]),
  audienceGender: z.enum(['male', 'female']).optional(),
  audienceReligion: z.string().optional(),
  audienceSegmentationId: z.uuid().optional(),
  audienceCustomerStatus: z.string().optional(),
  scheduledAt: z.string().datetime({ offset: true }).optional(),
})

export const sendBroadcastSchema = z.object({
  templateId: z.uuid(),
  recipientCount: z.number().int().min(0).optional(), // informational only, server recomputes
})

export const getBroadcastListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
})
