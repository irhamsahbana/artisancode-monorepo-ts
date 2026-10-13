import type { PaginationMetadata, PaginationQuery } from './common'

export type ProjectStatus = 'prospect' | 'in_progress' | 'won' | 'lost'

export interface ProjectProductLine {
  productId: string
  quantity: number
}

export interface Project {
  id: string
  projectNumber: string
  customerId: string
  contactId?: string
  name: string
  location?: string
  latitude?: number
  longitude?: number
  sourceOfFunds?: string
  picName?: string
  status: ProjectStatus
  estimatedValue?: number
  spkNumber?: string
  lostReason?: string
  winnerCompetitor?: string
  products?: ProjectProductLine[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectReq {
  projectNumber?: string
  customerId: string
  contactId?: string
  name: string
  location?: string
  latitude?: number
  longitude?: number
  sourceOfFunds?: string
  picName?: string
  status?: ProjectStatus
  estimatedValue?: number
  spkNumber?: string
  lostReason?: string
  winnerCompetitor?: string
  products?: ProjectProductLine[]
  notes?: string
}

export interface UpdateProjectReq {
  projectNumber?: string
  customerId?: string
  contactId?: string
  name?: string
  location?: string
  latitude?: number
  longitude?: number
  sourceOfFunds?: string
  picName?: string
  status?: ProjectStatus
  estimatedValue?: number
  spkNumber?: string
  lostReason?: string
  winnerCompetitor?: string
  products?: ProjectProductLine[]
  notes?: string
}

export interface GetProjectReq {
  q?: string
  status?: ProjectStatus
  customerId?: string
  pagination?: PaginationQuery
}

export interface ProjectList {
  items: Project[]
  pagination: PaginationMetadata
}

export interface ProjectMapMarker {
  id: string
  name: string
  status: ProjectStatus
  location?: string
  estimatedValue?: number
  latitude: number
  longitude: number
  createdAt: string
}

export interface ProjectVisit {
  id: string
  projectId: string
  visitDate: string
  metWith?: string
  topic?: string
  notes?: string
  createdAt: string
}

export interface CreateProjectVisitReq {
  projectId: string
  visitDate: string
  metWith?: string
  topic?: string
  notes?: string
}

export interface ProjectImportError {
  sheet: string
  row: number
  field?: string
  value?: string
  message: string
}

export interface ProjectImportRow {
  rowNumber: number
  projectNumber?: string
  name: string
  customerName: string
  customerId?: string
  contactName?: string
  contactId?: string
  status?: ProjectStatus
  estimatedValue?: number
  location?: string
  latitude?: number
  longitude?: number
  sourceOfFunds?: string
  picName?: string
  spkNumber?: string
  lostReason?: string
  winnerCompetitor?: string
  notes?: string
}

export interface ProjectProductImportRow {
  rowNumber: number
  projectRef: string
  productName: string
  productId?: string
  quantity: number
  unit?: string
}

export interface ProjectImportDryRunResult {
  totalProjects: number
  validProjects: number
  totalProducts: number
  validProducts: number
  errors: ProjectImportError[]
  previewProjects: ProjectImportRow[]
  previewProducts: ProjectProductImportRow[]
}

export interface ProjectImportExecuteReq {
  file: Buffer | Uint8Array
  mode?: 'skip' | 'upsert'
}

export interface ProjectImportExecuteResult {
  createdProjects: number
  updatedProjects: number
  skippedProjects: number
  attachedProducts: number
}
