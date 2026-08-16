import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { permissions, rolePermissions } from '@/db/schema'

export async function findPermissionNamesByRoleId(roleId: string): Promise<string[]> {
  const rows = await getExecutor()
    .select({ name: permissions.name })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId))

  return rows.map((r) => r.name)
}
