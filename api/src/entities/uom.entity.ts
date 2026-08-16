import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export type UomCategory = 'length' | 'area' | 'volume' | 'mass' | 'time' | 'quantity' | 'other'

export const UomCategories: UomCategory[] = [
  'length',
  'area',
  'volume',
  'mass',
  'time',
  'quantity',
  'other',
]

export interface UnitOfMeasurement {
  id: string
  name: string
  symbol: string
  category: UomCategory
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUomReq {
  name: string
  symbol: string
  category: UomCategory
}

export interface UpdateUomReq {
  id: string
  name?: string
  symbol?: string
  category?: UomCategory
  isActive?: boolean
}

export interface GetUomReq {
  q?: string
  category?: UomCategory
  isActive?: boolean
  pagination?: PaginationQuery
}

export interface UomList {
  items: UnitOfMeasurement[]
  pagination: PaginationMetadata
}

export interface UnitConversion {
  id: string
  fromUnitId: string
  toUnitId: string
  factor: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateUnitConversionReq {
  fromUnitId: string
  toUnitId: string
  factor: number
}

export interface UpdateUnitConversionReq {
  id: string
  fromUnitId?: string
  toUnitId?: string
  factor?: number
}

export interface UnitConversionList {
  items: UnitConversion[]
  pagination: PaginationMetadata
}
