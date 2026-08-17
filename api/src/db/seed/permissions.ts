import { PERMISSION_ACTIONS, PERMISSION_MODULES, PERMISSIONS } from '@artisancode/api-types'

import * as schema from '../schema'
import { db } from './client'

const { permissions } = schema

// Permission label lookup: "customers.view" → "Pelanggan: Lihat"
const MODULE_LABELS = new Map<string, string>(PERMISSION_MODULES.map((m) => [m.key, m.label]))
const ACTION_LABELS = new Map<string, string>(PERMISSION_ACTIONS.map((a) => [a.key, a.label]))

export async function upsertPermissions() {
  const ids: string[] = []

  for (const name of PERMISSIONS) {
    const existing = await db.query.permissions.findFirst({
      where: (t, { eq, and, isNull }) => and(eq(t.name, name), isNull(t.deletedAt)),
    })
    if (existing) {
      ids.push(existing.id)
      continue
    }
    const [moduleKey, actionKey] = name.split('.')
    const [row] = await db
      .insert(permissions)
      .values({
        name,
        description: `${MODULE_LABELS.get(moduleKey) ?? moduleKey}: ${ACTION_LABELS.get(actionKey) ?? actionKey}`,
      })
      .returning()
    ids.push(row.id)
  }

  console.log(`  permissions: ${ids.length} records`)
  return ids
}
