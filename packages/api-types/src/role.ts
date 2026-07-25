import type { PaginationMetadata } from './common'

// ponytail: fixed module x action matrix, not master data — same rationale as
// UNIT_OF_MEASUREMENT_CATEGORIES: validate against this on both FE (permission
// grid) and BE (schema enum) instead of a manageable permissions table.
export const PERMISSION_MODULES = [
  { key: 'customers', label: 'Pelanggan' },
  { key: 'projects', label: 'Proyek' },
  { key: 'quotations', label: 'Penawaran' },
  { key: 'broadcasts', label: 'Broadcast' },
  { key: 'ratings', label: 'Penilaian' },
  { key: 'master_segmentation', label: 'Master Data - Segmentasi' },
  { key: 'master_areas', label: 'Master Data - Area' },
  { key: 'master_relation_status', label: 'Master Data - Status Relasi' },
  { key: 'master_products', label: 'Master Data - Produk' },
  { key: 'master_uoms', label: 'Master Data - Satuan' },
  { key: 'master_unit_conversions', label: 'Master Data - Konversi Satuan' },
  { key: 'roles', label: 'Roles & Hak Akses' },
  { key: 'settings', label: 'Pengaturan' },
] as const

export const PERMISSION_ACTIONS = [
  { key: 'view', label: 'Lihat' },
  { key: 'create', label: 'Tambah' },
  { key: 'edit', label: 'Ubah' },
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
