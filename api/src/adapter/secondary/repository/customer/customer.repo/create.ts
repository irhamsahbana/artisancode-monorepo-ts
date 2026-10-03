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
      name: req.name,
      categoryId: req.categoryId,
      segmentationId: req.segmentationId,
      areaId: req.areaId,
      status: req.status ?? 'prospect',
      potential: req.potential ?? 'medium',
      hasContractHistory: req.hasContractHistory ?? false,
      lastRevenue: req.lastRevenue?.toString(),
      lastContractYear: req.lastContractYear,
      companyType: req.companyType,
      address: req.address,
      npwp: req.npwp,
      skt: req.skt,
      companyEmail: req.companyEmail,
      website: req.website,
      notes: req.notes,
    })
    .returning()
  return deps.toEntity(row)
}
