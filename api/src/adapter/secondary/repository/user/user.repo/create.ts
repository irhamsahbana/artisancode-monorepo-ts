import { localPhoneDigits } from '@artisancode/phone'

import { getExecutor } from '@/common/executor'
import { users } from '@/db/schema'
import * as Entity from '@/entities/user.entity'

import { UserRepoDeps } from '../user.repo'

export async function createUser(
  deps: UserRepoDeps,
  req: Entity.CreateUserReq,
): Promise<Entity.User> {
  const [row] = await getExecutor()
    .insert(users)
    .values({
      name: req.name,
      username: req.username,
      email: req.email,
      password: req.password,
      // Always store without the local trunk "0" — see find-by-phone.ts.
      phone: localPhoneDigits(req.phone),
      countryCode: req.country_code,
      roleId: req.role_id,
      status: req.status || 'active',
    })
    .returning()
  return deps.toEntity(row)
}
