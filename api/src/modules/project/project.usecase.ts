import { IContactRepo } from '@/contracts/contact.contract'
import { ICustomerRepo } from '@/contracts/customer.contract'
import type { ITransactor } from '@/contracts/integration'
import { IProductUsecase } from '@/contracts/product.contract'
import { IProjectRepo, IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProject } from './project.usecase/create'
import { createVisit } from './project.usecase/create-visit'
import { deleteProject } from './project.usecase/delete'
import { dryRunImport } from './project.usecase/dry-run-import'
import { executeImport } from './project.usecase/execute-import'
import { findAllVisits } from './project.usecase/find-all-visits'
import { findProjectById } from './project.usecase/find-by-id'
import { findProjectList } from './project.usecase/find-list'
import { findProjectMapMarkers } from './project.usecase/find-map-markers'
import { findVisitsByProjectId } from './project.usecase/find-visits-by-project-id'
import { generateTemplate } from './project.usecase/generate-template'
import { updateProject } from './project.usecase/update'

export interface ProjectUsecaseDeps {
  repo: IProjectRepo
  customerRepo: ICustomerRepo
  contactRepo: IContactRepo
  productUsecase: IProductUsecase
  transactor?: ITransactor
}

// Business rules for status transitions (won/lost are terminal).
export const ALLOWED_TRANSITIONS: Record<Entity.ProjectStatus, Entity.ProjectStatus[]> = {
  prospect: ['prospect', 'in_progress', 'won', 'lost'],
  in_progress: ['in_progress', 'won', 'lost', 'prospect'],
  won: ['won'],
  lost: ['lost'],
}

export function createProjectUsecase(
  repo: IProjectRepo,
  customerRepo: ICustomerRepo,
  contactRepo: IContactRepo,
  productUsecase: IProductUsecase,
  transactor?: ITransactor,
): IProjectUsecase {
  const deps: ProjectUsecaseDeps = {
    repo,
    customerRepo,
    contactRepo,
    productUsecase,
    transactor,
  }

  return {
    create: (req) => createProject(deps, req),
    findById: (id) => findProjectById(deps, id),
    findList: (req) => findProjectList(deps, req),
    findMapMarkers: () => findProjectMapMarkers(deps),
    update: (req) => updateProject(deps, req),
    delete: (id) => deleteProject(deps, id),
    createVisit: (req) => createVisit(deps, req),
    findVisitsByProjectId: (projectId) => findVisitsByProjectId(deps, projectId),
    findAllVisits: () => findAllVisits(deps),
    generateTemplate: () => generateTemplate(deps),
    dryRunImport: (fileBuffer) => dryRunImport(deps, fileBuffer),
    executeImport: (req) => executeImport(deps, req),
  }
}

export default createProjectUsecase
