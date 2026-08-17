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
  const { id, ...rest } = req

  await getExecutor().update(users).set(rest).where(eq(users.id, id))

  return findUserById(deps, id) as Promise<Entity.User>
}
