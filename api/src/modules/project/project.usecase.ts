import { AppError, ErrorCode } from '@artisancode/types'

import { IProjectRepo, IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

export interface ProjectUsecaseDeps {
  repo: IProjectRepo
}

// Business rules for status transitions (won/lost are terminal).
const ALLOWED_TRANSITIONS: Record<Entity.ProjectStatus, Entity.ProjectStatus[]> = {
  prospect: ['prospect', 'in_progress', 'won', 'lost'],
  in_progress: ['in_progress', 'won', 'lost', 'prospect'],
  won: ['won'],
  lost: ['lost'],
}

export function createProjectUsecase(repo: IProjectRepo): IProjectUsecase {
  const deps: ProjectUsecaseDeps = { repo }

  const assertStatusTransition = (current: Entity.ProjectStatus, next: Entity.ProjectStatus) => {
    if (!ALLOWED_TRANSITIONS[current].includes(next)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `Invalid status transition: ${current} -> ${next}`,
      )
    }
  }

  return {
    create: (req) => deps.repo.create(req),

    findById: async (id) => {
      const item = await deps.repo.findById(id)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
      return item
    },

    findList: (req) => deps.repo.findList(req),

    update: async (req) => {
      const existing = await deps.repo.findById(req.id)
      if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')

      if (req.status && req.status !== existing.status) {
        assertStatusTransition(existing.status, req.status)
      }

      const item = await deps.repo.update(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
      return item
    },

    delete: async (id) => {
      const existing = await deps.repo.findById(id)
      if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
      await deps.repo.delete(id)
    },

    createVisit: async (req) => {
      const project = await deps.repo.findById(req.projectId)
      if (!project) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
      return deps.repo.createVisit(req)
    },

    findVisitsByProjectId: async (projectId) => {
      const project = await deps.repo.findById(projectId)
      if (!project) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
      return deps.repo.findVisitsByProjectId(projectId)
    },

    findAllVisits: () => deps.repo.findAllVisits(),
  }
}
