import { getExecutor } from '@/common/executor'
import { customers } from '@/db/schema'
import * as Entity from '@/entities/customer.entity'

import { CustomerRepoDeps } from '../customer.repo'

export async function createCustomer(
  deps: CustomerRepoDeps,
  req: Entity.CreateCustomerReq,
): Promise<Entity.Customer> {
  const [row] = await getExecutor()
    .insert(customers)
    .values({
      companyId: req.company_id,
      name: req.name,
      type: req.type,
      categoryId: req.categoryId,
      areaId: req.areaId,
      status: req.status ?? 'prospect',
      potential: req.potential ?? 'medium',
      hasContractHistory: req.hasContractHistory ?? false,
      lastRevenue: req.lastRevenue?.toString(),
      lastContractYear: req.lastContractYear,
      gender: req.gender,
      address: req.address,
      birthPlace: req.birthPlace,
      dateOfBirth: req.dateOfBirth,
      religion: req.religion,
      education: req.education,
      email: req.email,
      spouseName: req.spouseName,
      spouseOccupation: req.spouseOccupation,
      childrenNames: req.childrenNames,
      childrenOccupation: req.childrenOccupation,
      character: req.character,
      hobby: req.hobby,
      companyName: req.companyName,
      position: req.position,
      companyAddress: req.companyAddress,
      whatsapp: req.whatsapp,
      notes: req.notes,
    })
    .returning()
  return deps.toEntity(row)
}
