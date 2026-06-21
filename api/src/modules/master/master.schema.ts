import { z } from 'zod'

export const createMasterItemSchema = z.object({
  name: z.string().min(1).max(100),
})

export const updateMasterItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  is_active: z.boolean().optional(),
})

export const getMasterItemListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  is_active: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
})
