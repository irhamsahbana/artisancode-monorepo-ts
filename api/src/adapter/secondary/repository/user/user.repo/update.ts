import { localPhoneDigits } from '@artisancode/phone'
import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { users } from '@/db/schema'
import * as Entity from '@/entities/user.entity'

import { findUserById } from './find-by-id'
import { UserRepoDeps } from '../user.repo'

export async function updateUser(
  deps: UserRepoDeps,
  req: Entity.UpdateUserReq,
): Promise<Entity.User> {
  const { id, role_id, country_code, ...rest } = req
  const updates: Partial<typeof users.$inferInsert> = { ...rest }
  if (role_id !== undefined) updates.roleId = role_id
  if (country_code !== undefined) updates.countryCode = country_code
  // Always store without the local trunk "0" — see find-by-phone.ts.
  if (updates.phone !== undefined) updates.phone = localPhoneDigits(updates.phone)

  await getExecutor().update(users).set(updates).where(eq(users.id, id))

  return findUserById(deps, id) as Promise<Entity.User>
}
