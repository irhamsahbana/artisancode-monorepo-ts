import { z } from 'zod'

import { UomCategories } from '@/entities/uom.entity'

export const createUomSchema = z.object({
  name: z.string().min(1).max(100),
  symbol: z.string().min(1).max(20),
  category: z.enum(UomCategories as [string, ...string[]]),
})

export const updateUomSchema = createUomSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const getUomListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  category: z.enum(UomCategories as [string, ...string[]]).optional(),
  is_active: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
})

export const createUnitConversionSchema = z.object({
  fromUnitId: z.uuid(),
  toUnitId: z.uuid(),
  factor: z.number().positive(),
})

export const updateUnitConversionSchema = createUnitConversionSchema.partial()

export const getUnitConversionListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
})
