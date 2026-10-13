/**
 * Database seeder — run with: bun src/db/seed/index.ts
 *
 * Seeds: reset → business profile → permissions → role → users → master items → uoms → unit conversions → customers → contacts → products → quotations → ratings → broadcasts
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
import { resetDatabase } from './reset'
import { upsertRole } from './roles'
import { seedUnitConversions } from './unit-conversions'
import { seedUoms } from './uoms'
import { seedUsers } from './users'

async function main() {
  console.log('Seeding database...')

  // Step 0: Truncate existing application data
  await resetDatabase()

  console.log('\n[1/13] Business profile')
  await upsertBusinessProfile()

  console.log('\n[2/13] Permissions')
  const permissionIds = await upsertPermissions()

  console.log('\n[3/13] Role')
  const role = await upsertRole(permissionIds)

  console.log('\n[4/13] Users')
  const credentials = await seedUsers(role.id)

  console.log('\n[5/13] Master items')
  const categoryIds = await seedMasterItems()

  console.log('\n[6/13] Uoms')
  const uomIds = await seedUoms()

  console.log('\n[7/13] Unit conversions')
  await seedUnitConversions(uomIds)

  console.log('\n[8/13] Customers')
  const customerIds = await seedCustomers(categoryIds)

  console.log('\n[9/13] Contacts')
  const contactIds = await seedContacts(customerIds)

  console.log('\n[10/13] Products')
  await seedProducts()

  console.log('\n[11/13] Quotations')
  await seedQuotations()

  console.log('\n[12/13] Ratings')
  await seedRatings(customerIds, contactIds)

  console.log('\n[13/13] Broadcasts')
  await seedBroadcasts()

  console.log('\nSeeding selesai!')
  console.log('\n================================================================================')
  console.log('                          KREDENSIAL PENGGUNA (SEEDED)                          ')
  console.log('================================================================================')
  for (const cred of credentials) {
    console.log(`  Nama     : ${cred.name}`)
    console.log(`  Username : ${cred.username}`)
    console.log(`  Email    : ${cred.email}`)
    console.log(`  Telepon  : ${cred.phone}`)
    console.log(`  Role     : ${cred.role}`)
    console.log(`  Password : ${cred.password}`)
    console.log('--------------------------------------------------------------------------------')
  }
  console.log('  Catatan  : Simpan password acak di atas untuk masuk ke sistem.')
  console.log('================================================================================\n')

  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
