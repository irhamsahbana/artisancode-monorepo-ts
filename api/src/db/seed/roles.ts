import { eq } from 'drizzle-orm'

import * as schema from '../schema'
import { db } from './client'

const { roles, rolePermissions } = schema

export async function upsertRole(permissionIds: string[]) {
  const existing = await db.query.roles.findFirst({
    where: (t, { eq, and, isNull }) => and(eq(t.name, 'Admin'), isNull(t.deletedAt)),
  })
  const role =
    existing ??
    (
      await db
        .insert(roles)
        .values({ name: 'Admin', description: 'Full access administrator', isSystem: true })
        .returning()
    )[0]
  if (existing) {
    console.log(`  role exists: ${existing.id}`)
    if (!existing.isSystem) {
      await db.update(roles).set({ isSystem: true }).where(eq(roles.id, existing.id))
    }
  } else {
    console.log(`  role created: ${role.id}`)
  }

  // Link all permissions to Admin (skip already-linked rows so re-runs are safe)
  const linked = await db
    .select({ permissionId: rolePermissions.permissionId })
    .from(rolePermissions)
    .where(eq(rolePermissions.roleId, role.id))
  const linkedIds = new Set(linked.map((rp) => rp.permissionId))
  const toInsert = permissionIds.filter((id) => !linkedIds.has(id))
  if (toInsert.length > 0) {
    await db
      .insert(rolePermissions)
      .values(toInsert.map((permissionId) => ({ roleId: role.id, permissionId })))
  }
  console.log(`  role_permissions: ${toInsert.length} linked (${linkedIds.size} already existed)`)

  return role
}
