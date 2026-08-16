import { AppError, ErrorCode } from '@artisancode/types'
import { and, inArray, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { permissions } from '@/db/schema'

/**
 * Resolve permission names (e.g. "customers.view") to their row ids.
 * Throws if any name has no row in the permissions table.
 */
export async function findPermissionIdsByNames(names: string[]): Promise<string[]> {
  const unique = [...new Set(names)]

  const rows = await getExecutor()
    .select({ id: permissions.id, name: permissions.name })
    .from(permissions)
    .where(and(inArray(permissions.name, unique), isNull(permissions.deletedAt)))

  const idByName = new Map(rows.map((r) => [r.name, r.id]))
  const missing = unique.filter((name) => !idByName.has(name))
  if (missing.length > 0) {
    throw new AppError(
      ErrorCode.NOT_FOUND,
      `Permission not found: ${missing.join(', ')}. Run the seeder to populate permissions.`,
    )
  }

  return unique.map((name) => idByName.get(name) as string)
}
