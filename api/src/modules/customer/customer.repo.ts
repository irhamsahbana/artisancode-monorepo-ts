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
    companyId: data.companyId,
    name: data.name,
    type: data.type,
    categoryId: data.categoryId,
    segmentationId: data.segmentationId,
    areaId: data.areaId,
    status: data.status,
    potential: data.potential,
    hasContractHistory: data.hasContractHistory,
    lastRevenue: data.lastRevenue,
    lastContractYear: data.lastContractYear,
    primaryContactId: data.primaryContactId,
    gender: data.gender,
    address: data.address,
    birthPlace: data.birthPlace,
    dateOfBirth: data.dateOfBirth,
    religion: data.religion,
    education: data.education,
    email: data.email,
    spouseName: data.spouseName,
    spouseOccupation: data.spouseOccupation,
    childrenNames: data.childrenNames,
    childrenOccupation: data.childrenOccupation,
    character: data.character,
    hobby: data.hobby,
    companyName: data.companyName,
    position: data.position,
    companyAddress: data.companyAddress,
    whatsapp: data.whatsapp,
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
    findById: (id, companyId) => findCustomerById(deps, id, companyId),
    findList: (req) => findCustomerList(deps, req),
    update: (req) => updateCustomer(deps, req),
    delete: (id, companyId) => deleteCustomer(id, companyId),
  }
}
