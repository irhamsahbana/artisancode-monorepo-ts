import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import type { ProjectRepoDeps } from '../project.repo'

export async function updateProject(
  deps: ProjectRepoDeps,
  req: Entity.UpdateProjectReq,
): Promise<Entity.Project | null> {
  const updates: Partial<typeof projects.$inferInsert> = { updatedAt: new Date() }
  if (req.projectNumber !== undefined) updates.projectNumber = req.projectNumber
  if (req.customerId !== undefined) updates.customerId = req.customerId
  if (req.contactId !== undefined) updates.contactId = req.contactId
  if (req.name !== undefined) updates.name = req.name
  if (req.location !== undefined) updates.location = req.location
  if (req.latitude !== undefined) updates.latitude = req.latitude?.toString()
  if (req.longitude !== undefined) updates.longitude = req.longitude?.toString()
  if (req.sourceOfFunds !== undefined) updates.sourceOfFunds = req.sourceOfFunds
  if (req.picName !== undefined) updates.picName = req.picName
  if (req.status !== undefined) updates.status = req.status
  if (req.estimatedValue !== undefined) updates.estimatedValue = req.estimatedValue?.toString()
  if (req.spkNumber !== undefined) updates.spkNumber = req.spkNumber
  if (req.lostReason !== undefined) updates.lostReason = req.lostReason
  if (req.winnerCompetitor !== undefined) updates.winnerCompetitor = req.winnerCompetitor
  if (req.products !== undefined)
    updates.products = req.products.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
    }))
  if (req.notes !== undefined) updates.notes = req.notes

  const [row] = await getExecutor()
    .update(projects)
    .set(updates)
    .where(and(eq(projects.id, req.id), isNull(projects.deletedAt)))
    .returning()
  return row ? deps.toEntity(row) : null
}
