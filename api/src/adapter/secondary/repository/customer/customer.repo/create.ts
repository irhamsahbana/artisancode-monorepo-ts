import { getExecutor } from '@/common/executor'
import { customers } from '@/db/schema'
import * as Entity from '@/entities/customer.entity'

import { CustomerRepoDeps } from '../customer.repo'

function toInsertRow(req: Entity.CreateCustomerReq): typeof customers.$inferInsert {
  return {
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
    phone: req.phone,
    fax: req.fax,
    phoneCountryCode: req.phoneCountryCode,
    faxCountryCode: req.faxCountryCode,
    website: req.website,
    notes: req.notes,
  }
}

export async function createCustomer(
  deps: CustomerRepoDeps,
  req: Entity.CreateCustomerReq,
): Promise<Entity.Customer> {
  const [row] = await getExecutor().insert(customers).values(toInsertRow(req)).returning()
  return deps.toEntity(row)
}

// Rows per INSERT: ~22 bound params per row, so 500 rows stays far below Postgres'
// 65,535-parameter limit while turning N round trips into N/500.
const BATCH_SIZE = 500

// Returns the created customers in the same order as `reqs`.
export async function createCustomers(
  deps: CustomerRepoDeps,
  reqs: Entity.CreateCustomerReq[],
): Promise<Entity.Customer[]> {
  const created: Entity.Customer[] = []
  for (let i = 0; i < reqs.length; i += BATCH_SIZE) {
    const rows = await getExecutor()
      .insert(customers)
      .values(reqs.slice(i, i + BATCH_SIZE).map(toInsertRow))
      .returning()
    created.push(...rows.map(deps.toEntity))
  }
  return created
}
