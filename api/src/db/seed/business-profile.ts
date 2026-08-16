import * as schema from '../schema'
import { db } from './client'

const { businessProfiles } = schema

const BUSINESS_NAME = 'PT Wika CRM Demo'

export async function upsertBusinessProfile() {
  const existing = await db.query.businessProfiles.findFirst()
  if (existing) {
    console.log(`  business profile exists: ${existing.id}`)
    return existing
  }
  const [row] = await db
    .insert(businessProfiles)
    .values({
      name: BUSINESS_NAME,
      businessType: 'Konstruksi & Infrastruktur',
      phone: '02150123456',
      email: 'info@wika.demo',
      address: 'Jl. Gatot Subroto No. 40, Jakarta Selatan',
    })
    .returning()
  console.log(`  business profile created: ${row.id}`)
  return row
}
