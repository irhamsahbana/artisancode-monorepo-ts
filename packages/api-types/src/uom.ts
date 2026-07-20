import type { PaginationMetadata, PaginationQuery } from './common'

export interface UnitOfMeasurement {
  id: string
  name: string
  symbol: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUnitOfMeasurementReq {
  name: string
  symbol: string
}

export interface UpdateUnitOfMeasurementReq {
  name?: string
  symbol?: string
  isActive?: boolean
}

export interface GetUnitOfMeasurementReq {
  q?: string
  isActive?: boolean
  pagination?: PaginationQuery
}

export interface UnitOfMeasurementList {
  items: UnitOfMeasurement[]
  pagination: PaginationMetadata
}

// Meaning: 1 fromUnitId = factor * toUnitId (e.g. from=sak, to=kg, factor=40).
export interface UnitConversion {
  id: string
  fromUnitId: string
  toUnitId: string
  factor: number
  createdAt: string
  updatedAt: string
}

export interface CreateUnitConversionReq {
  fromUnitId: string
  toUnitId: string
  factor: number
}

export interface UpdateUnitConversionReq {
  fromUnitId?: string
  toUnitId?: string
  factor?: number
}

export interface UnitConversionList {
  items: UnitConversion[]
  pagination: PaginationMetadata
}
