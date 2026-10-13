import { normalizePhoneDigits } from '@artisancode/phone'
import { eq } from 'drizzle-orm'

import { hashPassword } from '@/common/encryption'

import * as schema from '../schema'
import { db } from './client'

const { users } = schema

interface SeedUserConfig {
  name: string
  username: string
  email: string
  rawPhone: string
  countryCode: string
  isProtected?: boolean
}

export const SEED_USERS: SeedUserConfig[] = [
  {
    name: 'Irham',
    username: 'irham',
    email: 'irham@wika.demo',
    rawPhone: '82188449289',
    countryCode: '62',
    isProtected: true,
  },
  {
    name: 'Amri',
    username: 'amri',
    email: 'amri@wika.demo',
    rawPhone: '82328722713',
    countryCode: '62',
    isProtected: true,
  }
]

export async function seedUsers(roleId: string) {
  const hashedPassword = await hashPassword('password123')

  // Clear phone on pre-existing generic admin so it does not conflict with Irham's phone
  const existingAdmin = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, 'admin@wika.demo'),
  })
  if (existingAdmin && existingAdmin.phone === '82188449289') {
    await db.update(users).set({ phone: '' }).where(eq(users.id, existingAdmin.id))
  }

  const seededRows = []

  for (const userConfig of SEED_USERS) {
    const normalizedPhone = userConfig.rawPhone
      ? normalizePhoneDigits(userConfig.rawPhone, userConfig.countryCode)
      : ''

    const existing = await db.query.users.findFirst({
      where: (t, { eq, or }) =>
        or(
          eq(t.email, userConfig.email),
          eq(t.username, userConfig.username),
          ...(normalizedPhone ? [eq(t.phone, normalizedPhone)] : []),
        ),
    })

    if (existing) {
      console.log(`  user exists: ${existing.name} (${existing.email})`)
      const [updated] = await db
        .update(users)
        .set({
          name: userConfig.name,
          phone: normalizedPhone,
          countryCode: userConfig.countryCode,
          roleId,
          status: 'active',
          isProtected: userConfig.isProtected ?? true,
        })
        .where(eq(users.id, existing.id))
        .returning()
      seededRows.push(updated)
    } else {
      const [created] = await db
        .insert(users)
        .values({
          roleId,
          name: userConfig.name,
          username: userConfig.username,
          email: userConfig.email,
          password: hashedPassword,
          phone: normalizedPhone,
          countryCode: userConfig.countryCode,
          status: 'active',
          isProtected: userConfig.isProtected ?? true,
        })
        .returning()
      console.log(
        `  user created: ${created.name} (${created.email}, phone: ${created.countryCode}${created.phone})`,
      )
      seededRows.push(created)
    }
  }

  return seededRows[0]
}

export async function upsertAdminUser(roleId: string) {
  return seedUsers(roleId)
}
