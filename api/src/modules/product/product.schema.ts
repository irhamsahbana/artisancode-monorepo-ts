import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  unit: z.string().min(1).max(50),
})

export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const getProductListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  is_active: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
})
