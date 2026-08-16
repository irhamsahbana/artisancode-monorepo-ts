import * as schema from '../schema'
import { db } from './client'

const { permissions } = schema

// Define permissions locally instead of importing from api-types to avoid dependency issues
const PERMISSION_MODULES = [
  { key: 'business_profiles', label: 'Bisnis Profile' },
  { key: 'roles', label: 'Peran' },
  { key: 'users', label: 'Pengguna' },
  { key: 'customers', label: 'Pelanggan' },
  { key: 'contacts', label: 'Kontak' },
  { key: 'categories', label: 'Master' },
  { key: 'projects', label: 'Proyek' },
  { key: 'project_visits', label: 'Kunjungan Proyek' },
  { key: 'products', label: 'Produk' },
  { key: 'quotations', label: 'Penawaran Harga' },
  { key: 'customer_ratings', label: 'Rating Pelanggan' },
  { key: 'broadcast_templates', label: 'Template Broadcast' },
  { key: 'broadcast_logs', label: 'Log Broadcast' },
  { key: 'uoms', label: 'Satuan' },
  { key: 'unit_conversions', label: 'Konversi Satuan' },
]

const PERMISSION_ACTIONS = [
  { key: 'view', label: 'Lihat' },
  { key: 'create', label: 'Buat' },
  { key: 'update', label: 'Ubah' },
  { key: 'delete', label: 'Hapus' },
]

const PERMISSIONS = PERMISSION_MODULES.flatMap((m) =>
  PERMISSION_ACTIONS.map((a) => `${m.key}.${a.key}`),
)

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
