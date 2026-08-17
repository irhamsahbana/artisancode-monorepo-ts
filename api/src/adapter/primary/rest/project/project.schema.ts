import { z } from 'zod'

import { ProjectStatuses } from '@/entities/project.entity'

const projectProductLineSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().positive(),
})

const baseProjectSchema = z.object({
  projectNumber: z.string().min(1).max(50).optional(),
  customerId: z.uuid(),
  contactId: z.uuid().nullable().optional(),
  name: z.string().min(1).max(255),
  location: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  sourceOfFunds: z.string().optional(),
  picName: z.string().optional(),
  status: z.enum(ProjectStatuses as [string, ...string[]]).optional(),
  estimatedValue: z.number().min(0).optional(),
  spkNumber: z.string().optional(),
  lostReason: z.string().optional(),
  winnerCompetitor: z.string().optional(),
  products: z.array(projectProductLineSchema).optional(),
  notes: z.string().optional(),
})

export const createProjectSchema = baseProjectSchema

export const updateProjectSchema = baseProjectSchema.partial()

export const getProjectListSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  status: z.enum(ProjectStatuses as [string, ...string[]]).optional(),
  // Plain string, not z.uuid(): frontend select sends "" for "all", which
  // fails uuid validation — repo layer already treats a falsy filter as unset.
  customerId: z.string().optional(),
})

export const createProjectVisitSchema = z.object({
  projectId: z.uuid(),
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  metWith: z.string().optional(),
  topic: z.string().optional(),
  notes: z.string().optional(),
})
