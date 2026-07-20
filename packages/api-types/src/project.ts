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
