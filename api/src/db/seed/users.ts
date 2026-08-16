import { hashPassword } from '@/common/encryption'

import * as schema from '../schema'
import { db } from './client'

const { users } = schema

const ADMIN_EMAIL = 'admin@wika.demo'
const ADMIN_PASSWORD = 'password123'
const ADMIN_USERNAME = 'admin'

export async function upsertAdminUser(roleId: string) {
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
