import type { PaginationMetadata, PaginationQuery } from './common'

// ponytail: fixed set, not master data — validate against this on both FE
// (form Select) and BE (schema enum) instead of a manageable category table.
export const UNIT_OF_MEASUREMENT_CATEGORIES = [
  'length',
  'area',
  'volume',
  'mass',
  'time',
  'quantity',
  'other',
] as const

export type UnitOfMeasurementCategory =
  (typeof UNIT_OF_MEASUREMENT_CATEGORIES)[number]

export interface UnitOfMeasurement {
  id: string
  name: string
  symbol: string
  category: UnitOfMeasurementCategory
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUnitOfMeasurementReq {
  name: string
  symbol: string
  category: UnitOfMeasurementCategory
}

export interface UpdateUnitOfMeasurementReq {
  name?: string
  symbol?: string
  category?: UnitOfMeasurementCategory
  isActive?: boolean
}

export interface GetUnitOfMeasurementReq {
  q?: string
  category?: UnitOfMeasurementCategory
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
