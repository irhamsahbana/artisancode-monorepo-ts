import { z } from 'zod'

export const createContactSchema = z.object({
  customer_id: z.uuid(),
  name: z.string().min(1).max(255),
  position: z.string().optional(),
  whatsapp: z.string().optional(),
  country_code: z.string().optional(),
  email: z.email().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().optional(),
})

export const updateContactSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  position: z.string().optional(),
  whatsapp: z.string().optional(),
  country_code: z.string().optional(),
  email: z.email().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().optional(),
})

export const getContactListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  customer_id: z.uuid(),
})

export const searchContactPersonsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  gender: z.string().optional(),
  religion: z.string().optional(),
  // Plain string, not z.uuid(): frontend select sends "" for "all", which
  // fails uuid validation — repo layer already treats a falsy filter as unset.
  segmentationId: z.string().optional(),
  customerStatus: z.string().optional(),
})
