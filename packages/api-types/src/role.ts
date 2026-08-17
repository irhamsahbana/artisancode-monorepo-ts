import type { PaginationMetadata } from './common'

// ponytail: fixed module x action matrix, not master data — same rationale as
// UNIT_OF_MEASUREMENT_CATEGORIES: validate against this on both FE (permission
// grid) and BE (schema enum) instead of a manageable permissions table.
// Keys must match api/src/db/seed/permissions.ts exactly (that's what's
// actually seeded into the `permissions` table and assignable to roles).
export const PERMISSION_MODULES = [
  { key: 'business_profiles', label: 'Profil Bisnis' },
  { key: 'roles', label: 'Roles & Hak Akses' },
  { key: 'users', label: 'Pengguna' },
  { key: 'customers', label: 'Pelanggan' },
  { key: 'contacts', label: 'Kontak' },
  { key: 'categories', label: 'Master Data' },
  { key: 'projects', label: 'Proyek' },
  { key: 'project_visits', label: 'Kunjungan Proyek' },
  { key: 'products', label: 'Produk' },
  { key: 'quotations', label: 'Penawaran' },
  { key: 'customer_ratings', label: 'Penilaian' },
  { key: 'broadcast_templates', label: 'Template Broadcast' },
  { key: 'broadcast_logs', label: 'Log Broadcast' },
  { key: 'uoms', label: 'Satuan' },
  { key: 'unit_conversions', label: 'Konversi Satuan' },
] as const

// Modules rendered under the "Master Data" section of the permission grid.
export const MASTER_DATA_PERMISSION_MODULES = [
  'categories',
  'products',
  'uoms',
  'unit_conversions',
] as const

export const PERMISSION_ACTIONS = [
  { key: 'view', label: 'Lihat' },
  { key: 'create', label: 'Tambah' },
  { key: 'update', label: 'Ubah' },
  { key: 'delete', label: 'Hapus' },
] as const

export type PermissionModule = (typeof PERMISSION_MODULES)[number]['key']
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]['key']
export type Permission = `${PermissionModule}.${PermissionAction}`

export const PERMISSIONS: Permission[] = PERMISSION_MODULES.flatMap((m) =>
  PERMISSION_ACTIONS.map((a) => `${m.key}.${a.key}` as Permission),
)

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateRoleReq {
  name: string
  description?: string
  permissions: Permission[]
}

export interface UpdateRoleReq {
  name?: string
  description?: string
  permissions?: Permission[]
}

export interface GetRoleReq {
  q?: string
}

export interface RoleList {
  items: Role[]
  pagination: PaginationMetadata
}
