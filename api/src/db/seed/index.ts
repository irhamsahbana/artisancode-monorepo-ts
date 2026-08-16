/**
 * Database seeder — run with: bun src/db/seed/index.ts
 *
 * Seeds: business profile → permissions → role → user → master items → customers → contacts → products → quotations → ratings → broadcasts
 * Safe to re-run: skips existing records by checking unique columns.
 *
 * Updated to use same data as frontend demo (web/src/data/*)
 */
import { seedBroadcasts } from './broadcasts'
import { upsertBusinessProfile } from './business-profile'
import { client } from './client'
import { seedContacts } from './contacts'
import { seedCustomers } from './customers'
import { seedMasterItems } from './master-items'
import { upsertPermissions } from './permissions'
import { seedProducts } from './products'
import { seedQuotations } from './quotations'
import { seedRatings } from './ratings'
import { upsertRole } from './roles'
import { upsertAdminUser } from './users'

async function main() {
  console.log('Seeding database...')

  console.log('\n[1/11] Business profile')
  await upsertBusinessProfile()

  console.log('\n[2/11] Permissions')
  const permissionIds = await upsertPermissions()

  console.log('\n[3/11] Role')
  const role = await upsertRole(permissionIds)

  console.log('\n[4/11] Admin user')
  await upsertAdminUser(role.id)

  console.log('\n[5/11] Master items')
  const categoryIds = await seedMasterItems()

  console.log('\n[6/11] Customers')
  const customerIds = await seedCustomers(categoryIds)

  console.log('\n[7/11] Contacts')
  const contactIds = await seedContacts(customerIds)

  console.log('\n[8/11] Products')
  await seedProducts()

  console.log('\n[9/11] Quotations')
  await seedQuotations()

  console.log('\n[10/11] Ratings')
  await seedRatings(customerIds, contactIds)

  console.log('\n[11/11] Broadcasts')
  await seedBroadcasts()

  console.log('\nDone.')
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
