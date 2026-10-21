import { z } from 'zod'

import { CategoryStatuses } from '@/entities/category.entity'

export const createCategorySchema = z.object({
  parent_id: z.uuid().nullable().optional(),
  group: z.string().optional(),
  name: z.string().min(2).max(100),
  status: z.enum(CategoryStatuses as [string, ...string[]]).optional(),
})

export const updateCategorySchema = z.object({
  parent_id: z.uuid().nullable().optional(),
  group: z.string().optional(),
  name: z.string().min(2).max(100).optional(),
  status: z.enum(CategoryStatuses as [string, ...string[]]).optional(),
})

export const getCategoryListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  // master data lists are small and loaded whole by the UI (e.g. 159 areas), so allow up to 500
  limit: z.coerce.number().int().min(1).max(500).optional(),
  q: z.string().optional(),
  group: z.string().optional(),
  status: z.enum(CategoryStatuses as [string, ...string[]]).optional(),
  // default order is newest first; "name" is for pickers (alphabetical)
  sort: z.enum(['name']).optional(),
})
