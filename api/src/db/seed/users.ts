import crypto from 'crypto'

import { normalizePhoneDigits } from '@artisancode/phone'
import { eq } from 'drizzle-orm'

import { hashPassword } from '@/common/encryption'

import * as schema from '../schema'
import { db } from './client'

const { users } = schema

export interface SeededUserCredential {
  name: string
  username: string
  email: string
  phone: string
  role: string
  password: string
}

function generateRandomPassword(length = 12): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.randomBytes(length)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length]
  }
  return result
}

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
    rawPhone: '082188449289',
    countryCode: '62',
    isProtected: true,
  },
  {
    name: 'Amri',
    username: 'amri',
    email: 'amri@wika.demo',
    rawPhone: '+62 823-2872-2713',
    countryCode: '62',
    isProtected: true,
  },
  {
    name: 'Administrator',
    username: 'admin',
    email: 'admin@wika.demo',
    rawPhone: '',
    countryCode: '62',
    isProtected: true,
  },
]

export async function seedUsers(roleId: string): Promise<SeededUserCredential[]> {
  const credentials: SeededUserCredential[] = []

  // Clear phone on pre-existing generic admin so it does not conflict with Irham's phone
  const existingAdmin = await db.query.users.findFirst({
    where: (t, { eq: eqOp }) => eqOp(t.email, 'admin@wika.demo'),
  })
  if (existingAdmin && existingAdmin.phone === '82188449289') {
    await db.update(users).set({ phone: '' }).where(eq(users.id, existingAdmin.id))
  }

  for (const userConfig of SEED_USERS) {
    const rawPassword = generateRandomPassword(12)
    const hashedPassword = await hashPassword(rawPassword)

    const normalizedPhone = userConfig.rawPhone
      ? normalizePhoneDigits(userConfig.rawPhone, userConfig.countryCode)
      : ''

    const existing = await db.query.users.findFirst({
      where: (t, { eq: eqOp, or: orOp }) =>
        orOp(
          eqOp(t.email, userConfig.email),
          eqOp(t.username, userConfig.username),
          ...(normalizedPhone ? [eqOp(t.phone, normalizedPhone)] : []),
        ),
    })

    if (existing) {
      console.log(`  user updated: ${userConfig.name} (${userConfig.email})`)
      await db
        .update(users)
        .set({
          name: userConfig.name,
          username: userConfig.username,
          email: userConfig.email,
          password: hashedPassword,
          phone: normalizedPhone,
          countryCode: userConfig.countryCode,
          roleId,
          status: 'active',
          isProtected: userConfig.isProtected ?? true,
        })
        .where(eq(users.id, existing.id))
    } else {
      await db.insert(users).values({
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
      console.log(
        `  user created: ${userConfig.name} (${userConfig.email}, phone: ${userConfig.countryCode}${normalizedPhone})`,
      )
    }

    credentials.push({
      name: userConfig.name,
      username: userConfig.username,
      email: userConfig.email,
      phone: normalizedPhone ? `+${userConfig.countryCode} ${normalizedPhone}` : '-',
      role: 'Admin',
      password: rawPassword,
    })
  }

  return credentials
}

export async function upsertAdminUser(roleId: string): Promise<SeededUserCredential[]> {
  return seedUsers(roleId)
}
