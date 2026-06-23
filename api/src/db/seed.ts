/**
 * Database seeder — run with: bun src/db/seed.ts
 *
 * Seeds: company → role → user → master items → customers → contacts
 * Safe to re-run: skips existing records by checking unique columns.
 */
import { faker } from '@faker-js/faker'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { hashPassword } from '@/common/encryption'
import * as schema from '@/db/schema'

const { companies, roles, users, categories, customers, contacts } = schema

// ---------------------------------------------------------------------------
// DB connection (standalone — does not go through the app's singleton)
// ---------------------------------------------------------------------------
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL env var is not set')

const client = postgres(DATABASE_URL, { max: 1 })
const db = drizzle(client, { schema })

// ---------------------------------------------------------------------------
// Seed data definitions
// ---------------------------------------------------------------------------
const COMPANY_NAME = 'PT Wika CRM Demo'
const ADMIN_EMAIL = 'admin@wika.demo'
const ADMIN_PASSWORD = 'password123'
const ADMIN_USERNAME = 'admin'

const MASTER_ITEMS = {
  customer_category: ['Premium', 'Regular', 'VIP', 'Bronze', 'Silver', 'Gold'],
  segmentation: ['Government', 'Private', 'BUMN', 'Individual', 'NGO'],
  area: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar', 'Semarang', 'Bali'],
  relation_status: ['New', 'Existing', 'Partner', 'Ex-Client', 'Prospect'],
} as const

type MasterGroup = keyof typeof MASTER_ITEMS

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function upsertCompany() {
  const existing = await db.query.companies.findFirst({
    where: (t, { eq }) => eq(t.name, COMPANY_NAME),
  })
  if (existing) {
    console.log(`  company exists: ${existing.id}`)
    return existing
  }
  const [row] = await db
    .insert(companies)
    .values({
      name: COMPANY_NAME,
      businessType: 'Konstruksi & Infrastruktur',
      phone: '02150123456',
      email: 'info@wika.demo',
      address: 'Jl. Gatot Subroto No. 40, Jakarta Selatan',
    })
    .returning()
  console.log(`  company created: ${row.id}`)
  return row
}

async function upsertRole(companyId: string) {
  const existing = await db.query.roles.findFirst({
    where: (t, { eq, and, isNull }) =>
      and(eq(t.companyId, companyId), eq(t.name, 'Admin'), isNull(t.deletedAt)),
  })
  if (existing) {
    console.log(`  role exists: ${existing.id}`)
    return existing
  }
  const [row] = await db
    .insert(roles)
    .values({ companyId, name: 'Admin', description: 'Full access administrator' })
    .returning()
  console.log(`  role created: ${row.id}`)
  return row
}

async function upsertAdminUser(companyId: string, roleId: string) {
  const existing = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, ADMIN_EMAIL),
  })
  if (existing) {
    console.log(`  user exists: ${existing.id}`)
    return existing
  }
  const [row] = await db
    .insert(users)
    .values({
      companyId,
      roleId,
      name: 'Administrator',
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: await hashPassword(ADMIN_PASSWORD),
      phone: '081200000000',
    })
    .returning()
  console.log(`  user created: ${row.id} (email: ${ADMIN_EMAIL}, password: ${ADMIN_PASSWORD})`)
  return row
}

async function seedMasterItems(companyId: string) {
  const ids: Record<string, string[]> = {
    customer_category: [],
    segmentation: [],
    area: [],
    relation_status: [],
  }

  for (const [group, names] of Object.entries(MASTER_ITEMS)) {
    for (const name of names) {
      const existing = await db.query.categories.findFirst({
        where: (t, { eq, and, isNull }) =>
          and(
            eq(t.companyId, companyId),
            eq(t.group, group),
            eq(t.name, name),
            isNull(t.deletedAt),
          ),
      })
      if (existing) {
        ids[group].push(existing.id)
        continue
      }
      const [row] = await db
        .insert(categories)
        .values({ companyId, group: group as MasterGroup, name })
        .returning()
      ids[group].push(row.id)
    }
    console.log(`  categories[${group}]: ${ids[group].length} records`)
  }

  return ids
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function seedCustomers(companyId: string, masterIds: Record<string, string[]>, count = 20) {
  const customerIds: string[] = []

  for (let i = 0; i < count; i++) {
    const type = pick(['individual', 'business'] as const)
    const status = pick(['prospect', 'active', 'inactive'] as const)
    const potential = pick(['high', 'medium', 'low'] as const)
    const name =
      type === 'individual'
        ? faker.person.fullName()
        : `PT ${faker.company.name().replace(/[,.']/g, '')}`

    const [row] = await db
      .insert(customers)
      .values({
        companyId,
        name,
        type,
        status,
        potential,
        categoryId: pick(masterIds['customer_category']),
        segmentationId: pick(masterIds['segmentation']),
        areaId: pick(masterIds['area']),
        hasContractHistory: Math.random() > 0.5,
        lastRevenue:
          Math.random() > 0.5 ? String(faker.number.int({ min: 10, max: 5000 }) * 1_000_000) : null,
        lastContractYear: Math.random() > 0.5 ? faker.number.int({ min: 2018, max: 2025 }) : null,
        // personal (individual only)
        gender: type === 'individual' ? pick(['male', 'female'] as const) : null,
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        whatsapp: `08${faker.string.numeric(10)}`,
        notes: Math.random() > 0.6 ? faker.lorem.sentence() : null,
        // company info (business only)
        companyName: type === 'business' ? name : null,
        position: type === 'business' ? faker.person.jobTitle() : null,
        companyAddress: type === 'business' ? faker.location.streetAddress() : null,
      })
      .returning()

    customerIds.push(row.id)
  }

  console.log(`  customers: ${customerIds.length} records`)
  return customerIds
}

async function seedContacts(customerIds: string[]) {
  let total = 0
  for (const customerId of customerIds) {
    const contactCount = Math.random() > 0.4 ? 2 : 1
    for (let i = 0; i < contactCount; i++) {
      await db.insert(contacts).values({
        customerId,
        name: faker.person.fullName(),
        position: faker.person.jobTitle(),
        whatsapp: `08${faker.string.numeric(10)}`,
        email: faker.internet.email(),
        isPrimary: i === 0,
        notes: Math.random() > 0.7 ? faker.lorem.sentence() : null,
      })
      total++
    }
  }
  console.log(`  contacts: ${total} records`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Seeding database...')

  console.log('\n[1/6] Company')
  const company = await upsertCompany()

  console.log('\n[2/6] Role')
  const role = await upsertRole(company.id)

  console.log('\n[3/6] Admin user')
  await upsertAdminUser(company.id, role.id)

  console.log('\n[4/6] Master items')
  const masterIds = await seedMasterItems(company.id)

  console.log('\n[5/6] Customers')
  const customerIds = await seedCustomers(company.id, masterIds)

  console.log('\n[6/6] Contacts')
  await seedContacts(customerIds)

  console.log('\nDone.')
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
