import * as schema from '../schema'
import { db } from './client'

const { categories } = schema

// From web/src/data/master.ts
const MASTER_DATA = {
  segmentation: [
    { id: 'seg1', name: 'UMKM', status: 'active' },
    { id: 'seg2', name: 'Korporat', status: 'active' },
    { id: 'seg3', name: 'Enterprise', status: 'active' },
    { id: 'seg4', name: 'Startup', status: 'active' },
    { id: 'seg5', name: 'Freelancer', status: 'inactive' },
  ],
  area: [
    { id: 'area1', name: 'Jakarta Selatan', status: 'active' },
    { id: 'area2', name: 'Jakarta Barat', status: 'active' },
    { id: 'area3', name: 'Bandung', status: 'active' },
    { id: 'area4', name: 'Surabaya', status: 'active' },
    { id: 'area5', name: 'Yogyakarta', status: 'active' },
    { id: 'area6', name: 'Medan', status: 'inactive' },
  ],
  relation_status: [
    { id: 'rs1', name: 'Prospek', status: 'active' },
    { id: 'rs2', name: 'Aktif', status: 'active' },
    { id: 'rs3', name: 'Tidak Aktif', status: 'active' },
    { id: 'rs4', name: 'Blacklist', status: 'inactive' },
  ],
} as const

// Maps the demo IDs above (e.g. "seg2") to the real UUIDs generated on insert,
// so seedCustomers/seedBroadcasts can resolve segmentationId/areaId/audienceSegmentationId refs.
export async function seedMasterItems() {
  const categoryIds = new Map<string, string>()

  for (const [group, items] of Object.entries(MASTER_DATA)) {
    let count = 0
    for (const item of items) {
      const existing = await db.query.categories.findFirst({
        where: (t, { eq, and, isNull }) =>
          and(eq(t.group, group), eq(t.name, item.name), isNull(t.deletedAt)),
      })
      if (existing) {
        categoryIds.set(item.id, existing.id)
        count++
        continue
      }
      const [row] = await db
        .insert(categories)
        .values({ group, name: item.name, status: item.status })
        .returning()
      categoryIds.set(item.id, row.id)
      count++
    }
    console.log(`  categories[${group}]: ${count} records`)
  }

  return categoryIds
}
