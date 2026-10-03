import { ICustomerRepo } from '@/contracts/customer.contract'
import { customers } from '@/db/schema'
import * as Entity from '@/entities/customer.entity'

import { createCustomer } from './customer.repo/create'
import { deleteCustomer } from './customer.repo/delete'
import { findCustomerById } from './customer.repo/find-by-id'
import { findCustomerList } from './customer.repo/find-list'
import { updateCustomer } from './customer.repo/update'

export interface CustomerRepoDeps {
  toEntity: (data: typeof customers.$inferSelect) => Entity.Customer
}

function toEntity(data: typeof customers.$inferSelect): Entity.Customer {
  return {
    id: data.id,
    name: data.name,
    categoryId: data.categoryId,
    segmentationId: data.segmentationId,
    areaId: data.areaId,
    status: data.status,
    potential: data.potential,
    hasContractHistory: data.hasContractHistory,
    lastRevenue: data.lastRevenue,
    lastContractYear: data.lastContractYear,
    primaryContactId: data.primaryContactId,
    companyType: data.companyType,
    address: data.address,
    npwp: data.npwp,
    skt: data.skt,
    companyEmail: data.companyEmail,
    website: data.website,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  }
}

export function createCustomerRepo(): ICustomerRepo {
  const deps: CustomerRepoDeps = { toEntity }

  return {
    create: (req) => createCustomer(deps, req),
    findById: (id) => findCustomerById(deps, id),
    findList: (req) => findCustomerList(deps, req),
    update: (req) => updateCustomer(deps, req),
    delete: (id) => deleteCustomer(id),
  }
}
