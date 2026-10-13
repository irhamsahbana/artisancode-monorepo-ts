import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import type { ProjectRepoDeps } from '../project.repo'

export async function createProject(
  deps: ProjectRepoDeps,
  req: Entity.CreateProjectReq,
): Promise<Entity.Project> {
  const [row] = await getExecutor()
    .insert(projects)
    .values({
      projectNumber: req.projectNumber || deps.generateProjectNumber(),
      customerId: req.customerId,
      contactId: req.contactId ?? null,
      name: req.name,
      location: req.location,
      latitude: req.latitude?.toString(),
      longitude: req.longitude?.toString(),
      sourceOfFunds: req.sourceOfFunds,
      picName: req.picName,
      status: req.status ?? 'prospect',
      estimatedValue: req.estimatedValue?.toString(),
      spkNumber: req.spkNumber,
      lostReason: req.lostReason,
      winnerCompetitor: req.winnerCompetitor,
      products: (req.products ?? []).map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
      })),
      notes: req.notes,
    })
    .returning()
  return deps.toEntity(row)
}
