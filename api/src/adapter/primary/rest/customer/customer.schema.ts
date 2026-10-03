import { z } from 'zod'

import { CompanyTypes, CustomerPotentials, CustomerStatuses } from '@/entities/customer.entity'

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(255),
  category_id: z.uuid().optional(),
  segmentation_id: z.uuid().optional(),
  area_id: z.uuid().optional(),
  status: z.enum(CustomerStatuses as [string, ...string[]]).optional(),
  potential: z.enum(CustomerPotentials as [string, ...string[]]).optional(),
  has_contract_history: z.boolean().optional(),
  last_revenue: z.number().optional(),
  last_contract_year: z.number().int().optional(),
  company_type: z.enum(CompanyTypes as [string, ...string[]]).optional(),
  address: z.string().optional(),
  npwp: z.string().optional(),
  skt: z.string().optional(),
  company_email: z.email().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
})

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  primary_contact_id: z.uuid().optional(),
})

export const getCustomerListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  status: z.enum(CustomerStatuses as [string, ...string[]]).optional(),
  potential: z.enum(CustomerPotentials as [string, ...string[]]).optional(),
  // Plain string, not z.uuid(): frontend selects send "" for "all", which
  // fails uuid validation — repo layer already treats a falsy filter as unset.
  category_id: z.string().optional(),
  segmentation_id: z.string().optional(),
  area_id: z.string().optional(),
  has_contract_history: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
})
