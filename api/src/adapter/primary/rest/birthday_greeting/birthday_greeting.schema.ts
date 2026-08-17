import { z } from 'zod'

export const updateBirthdayGreetingSchema = z.object({
  message: z.string().min(1).optional(),
  enabled: z.boolean().optional(),
  audienceGender: z.enum(['male', 'female']).optional(),
  audienceReligion: z.string().optional(),
  audienceSegmentationId: z.uuid().optional(),
  audienceCustomerStatus: z.string().optional(),
})
