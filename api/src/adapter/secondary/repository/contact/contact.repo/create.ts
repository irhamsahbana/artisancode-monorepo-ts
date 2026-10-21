import { getExecutor } from '@/common/executor'
import { contacts } from '@/db/schema'
import * as Entity from '@/entities/contact.entity'

import { ContactRepoDeps } from '../contact.repo'

function toInsertRow(req: Entity.CreateContactReq): typeof contacts.$inferInsert {
  return {
    customerId: req.customer_id,
    name: req.name,
    position: req.position,
    whatsapp: req.whatsapp,
    countryCode: req.country_code,
    email: req.email,
    landline: req.landline,
    landlineCountryCode: req.landline_country_code,
    gender: req.gender,
    birthPlace: req.birthPlace,
    dateOfBirth: req.dateOfBirth,
    religion: req.religion,
    education: req.education,
    address: req.address,
    spouseName: req.spouseName,
    spouseOccupation: req.spouseOccupation,
    childrenNames: req.childrenNames,
    childrenOccupation: req.childrenOccupation,
    profiling: req.profiling,
    notes: req.notes,
    isPrimary: req.isPrimary ?? false,
  }
}

export async function createContact(
  deps: ContactRepoDeps,
  req: Entity.CreateContactReq,
): Promise<Entity.Contact> {
  const [row] = await getExecutor().insert(contacts).values(toInsertRow(req)).returning()
  return deps.toEntity(row)
}

// ~24 bound params per row; 500 rows/INSERT is far below Postgres' 65,535-parameter limit.
const BATCH_SIZE = 500

// Returns the created contacts in the same order as `reqs`.
export async function createContacts(
  deps: ContactRepoDeps,
  reqs: Entity.CreateContactReq[],
): Promise<Entity.Contact[]> {
  const created: Entity.Contact[] = []
  for (let i = 0; i < reqs.length; i += BATCH_SIZE) {
    const rows = await getExecutor()
      .insert(contacts)
      .values(reqs.slice(i, i + BATCH_SIZE).map(toInsertRow))
      .returning()
    created.push(...rows.map(deps.toEntity))
  }
  return created
}
