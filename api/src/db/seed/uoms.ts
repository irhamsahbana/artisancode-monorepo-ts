import * as schema from '../schema'
import { db } from './client'

const { uoms } = schema

// From web/src/data/uoms.ts
const UOMS = [
  { id: 'uom1', name: 'Kilogram', symbol: 'kg', category: 'mass' },
  { id: 'uom2', name: 'Gram', symbol: 'gram', category: 'mass' },
  { id: 'uom3', name: 'Sak', symbol: 'sak', category: 'quantity' },
  { id: 'uom4', name: 'Meter Kubik', symbol: 'm3', category: 'volume' },
  { id: 'uom5', name: 'Liter', symbol: 'liter', category: 'volume' },
  { id: 'uom6', name: 'Meter Persegi', symbol: 'm2', category: 'area' },
  { id: 'uom7', name: 'Batang', symbol: 'batang', category: 'quantity' },
  { id: 'uom8', name: 'Unit', symbol: 'unit', category: 'quantity' },
] as const

export async function seedUoms(): Promise<Map<string, string>> {
  const ids = new Map<string, string>()
  let total = 0
  for (const { id: demoId, ...uom } of UOMS) {
    const existing = await db.query.uoms.findFirst({
      where: (t, { eq }) => eq(t.symbol, uom.symbol),
    })
    const uomId = existing ? existing.id : (await db.insert(uoms).values(uom).returning())[0].id
    ids.set(demoId, uomId)
    total++
  }
  console.log(`  uoms: ${total} records`)
  return ids
}
