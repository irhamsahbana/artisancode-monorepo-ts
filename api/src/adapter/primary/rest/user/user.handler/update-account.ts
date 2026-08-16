import { AppEnv, AppError, ErrorCode } from '@artisancode/types'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { Context } from 'hono'

import { comparePassword, hashPassword } from '@/common/encryption'
import { getExecutor } from '@/common/executor'
import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { users } from '@/db/schema'

// ponytail: no usecase dep — handler operates directly on DB for password verification
export function updateAccountHandler() {
  return async (c: Context<AppEnv>) => {
    const body = c.get('body')
    const user = getUserContext()
    const userId = user?.id || ''

    // If changing password, verify current password first
    if (body.new_password) {
      if (!body.current_password) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          'Current password is required to set a new password',
        )
      }

      const [row] = await getExecutor()
        .select({ password: users.password })
        .from(users)
        .where(and(eq(users.id, userId), isNull(users.deletedAt)))
        .limit(1)

      if (!row) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')

      const valid = await comparePassword(body.current_password, row.password)
      if (!valid)
        throw new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, 'Current password is incorrect')
    }

    const updates: Record<string, unknown> = {
      updatedAt: sql`now()`,
    }

    if (body.name !== undefined) updates.name = body.name
    if (body.email !== undefined) updates.email = body.email
    if (body.new_password) updates.password = await hashPassword(body.new_password)

    const [updated] = await getExecutor()
      .update(users)
      .set(updates)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .returning()

    if (!updated) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')

    return c.json(
      responseSuccess(
        { id: updated.id, name: updated.name, email: updated.email },
        'Account updated successfully',
      ),
    )
  }
}
