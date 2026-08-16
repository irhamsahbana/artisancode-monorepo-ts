import { z } from 'zod'

import { CustomerPotentials, CustomerStatuses, CustomerTypes } from '@/entities/customer.entity'

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(CustomerTypes as [string, ...string[]]),
  category_id: z.uuid().optional(),
  segmentation_id: z.uuid().optional(),
  area_id: z.uuid().optional(),
  status: z.enum(CustomerStatuses as [string, ...string[]]).optional(),
  potential: z.enum(CustomerPotentials as [string, ...string[]]).optional(),
  has_contract_history: z.boolean().optional(),
  last_revenue: z.number().optional(),
  last_contract_year: z.number().int().optional(),
  gender: z.enum(['male', 'female']).optional(),
  address: z.string().optional(),
  birth_place: z.string().optional(),
  date_of_birth: z.string().optional(),
  religion: z.string().optional(),
  education: z.string().optional(),
  email: z.email().optional(),
  spouse_name: z.string().optional(),
  spouse_occupation: z.string().optional(),
  children_names: z.string().optional(),
  children_occupation: z.string().optional(),
  character: z.string().optional(),
  hobby: z.string().optional(),
  company_name: z.string().optional(),
  position: z.string().optional(),
  company_address: z.string().optional(),
  whatsapp: z.string().optional(),
  notes: z.string().optional(),
})

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  primary_contact_id: z.uuid().optional(),
})

export const getCustomerListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  type: z.enum(CustomerTypes as [string, ...string[]]).optional(),
  status: z.enum(CustomerStatuses as [string, ...string[]]).optional(),
  potential: z.enum(CustomerPotentials as [string, ...string[]]).optional(),
  category_id: z.uuid().optional(),
  segmentation_id: z.uuid().optional(),
  area_id: z.uuid().optional(),
  has_contract_history: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
})
