import { IProjectRepo } from '@/contracts/project.contract'
import { projects, projectVisits } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import { createProject } from './project.repo/create'
import { createProjectVisit } from './project.repo/create-visit'
import { deleteProject } from './project.repo/delete'
import { findAllProjectVisits } from './project.repo/find-all-visits'
import { findProjectById } from './project.repo/find-by-id'
import { findProjectList } from './project.repo/find-list'
import { findProjectMapMarkers } from './project.repo/find-map-markers'
import { findProjectsByNamesAndCustomers } from './project.repo/find-projects-by-names-and-customers'
import { findProjectsByNumbers } from './project.repo/find-projects-by-numbers'
import { findVisitsByProjectId } from './project.repo/find-visits-by-project-id'
import { updateProject } from './project.repo/update'

export interface ProjectRepoDeps {
  toEntity: (data: typeof projects.$inferSelect) => Entity.Project
  visitToEntity: (data: typeof projectVisits.$inferSelect) => Entity.ProjectVisit
  generateProjectNumber: () => string
}

function toEntity(data: typeof projects.$inferSelect): Entity.Project {
  return {
    id: data.id,
    projectNumber: data.projectNumber,
    customerId: data.customerId,
    contactId: data.contactId,
    name: data.name,
    location: data.location,
    latitude: data.latitude ? Number(data.latitude) : null,
    longitude: data.longitude ? Number(data.longitude) : null,
    sourceOfFunds: data.sourceOfFunds,
    picName: data.picName,
    status: data.status,
    estimatedValue: data.estimatedValue ? Number(data.estimatedValue) : null,
    spkNumber: data.spkNumber,
    lostReason: data.lostReason,
    winnerCompetitor: data.winnerCompetitor,
    products: data.products,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function visitToEntity(data: typeof projectVisits.$inferSelect): Entity.ProjectVisit {
  return {
    id: data.id,
    projectId: data.projectId,
    visitDate: data.visitDate,
    metWith: data.metWith,
    topic: data.topic,
    notes: data.notes,
    createdAt: data.createdAt,
  }
}

function generateProjectNumber(): string {
  return `PRJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

export function createProjectRepo(): IProjectRepo {
  const deps: ProjectRepoDeps = {
    toEntity,
    visitToEntity,
    generateProjectNumber,
  }

  return {
    create: (req) => createProject(deps, req),
    findById: (id) => findProjectById(deps, id),
    findList: (req) => findProjectList(deps, req),
    findMapMarkers: () => findProjectMapMarkers(deps),
    update: (req) => updateProject(deps, req),
    delete: (id) => deleteProject(id),
    createVisit: (req) => createProjectVisit(deps, req),
    findVisitsByProjectId: (projectId) => findVisitsByProjectId(deps, projectId),
    findAllVisits: () => findAllProjectVisits(deps),
    findProjectsByNumbers: (numbers) => findProjectsByNumbers(deps, numbers),
    findProjectsByNamesAndCustomers: (items) => findProjectsByNamesAndCustomers(deps, items),
  }
}

export default createProjectRepo
