import { z } from 'zod'

export const updateBusinessProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  business_type: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional(),
  address: z.string().optional(),
})
