import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'

import { createProjectHandler as makeCreate } from './create'
import { createProjectVisitHandler as makeCreateVisit } from './create-visit'
import { deleteProjectHandler as makeDelete } from './delete'
import { findAllProjectVisitsHandler as makeFindAllVisits } from './find-all-visits'
import { findProjectByIdHandler as makeFindById } from './find-by-id'
import { findProjectListHandler as makeFindList } from './find-list'
import { findProjectMapMarkersHandler as makeFindMapMarkers } from './find-map-markers'
import { findVisitsByProjectIdHandler as makeFindVisitsByProjectId } from './find-visits-by-project-id'
import { updateProjectHandler as makeUpdate } from './update'

export function createProjectHandlerDeps(usecase: IProjectUsecase) {
  const handlers = {
    create: makeCreate(usecase),
    findById: makeFindById(usecase),
    findList: makeFindList(usecase),
    findMapMarkers: makeFindMapMarkers(usecase),
    update: makeUpdate(usecase),
    delete: makeDelete(usecase),
    createVisit: makeCreateVisit(usecase),
    findVisitsByProjectId: makeFindVisitsByProjectId(usecase),
    findAllVisits: makeFindAllVisits(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('ProjectHandler.create', () => handlers.create(c)),
    findById: (c: Context<AppEnv>) =>
      withSpan('ProjectHandler.findById', () => handlers.findById(c)),
    findList: (c: Context<AppEnv>) =>
      withSpan('ProjectHandler.findList', () => handlers.findList(c)),
    findMapMarkers: (c: Context<AppEnv>) =>
      withSpan('ProjectHandler.findMapMarkers', () => handlers.findMapMarkers(c)),
    update: (c: Context<AppEnv>) => withSpan('ProjectHandler.update', () => handlers.update(c)),
    delete: (c: Context<AppEnv>) => withSpan('ProjectHandler.delete', () => handlers.delete(c)),
    createVisit: (c: Context<AppEnv>) =>
      withSpan('ProjectHandler.createVisit', () => handlers.createVisit(c)),
    findVisitsByProjectId: (c: Context<AppEnv>) =>
      withSpan('ProjectHandler.findVisitsByProjectId', () => handlers.findVisitsByProjectId(c)),
    findAllVisits: (c: Context<AppEnv>) =>
      withSpan('ProjectHandler.findAllVisits', () => handlers.findAllVisits(c)),
  }
}

export { createProjectHandlerDeps as createProjectHandler }
