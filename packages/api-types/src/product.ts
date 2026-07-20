import type { PaginationMetadata, PaginationQuery } from './common'

export interface Product {
  id: string
  name: string
  unit: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductReq {
  name: string
  unit: string
}

export interface UpdateProductReq {
  name?: string
  unit?: string
  isActive?: boolean
}

export interface GetProductReq {
  q?: string
  isActive?: boolean
  pagination?: PaginationQuery
}

export interface ProductList {
  items: Product[]
  pagination: PaginationMetadata
}
