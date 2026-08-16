import * as schema from '../schema'
import { db } from './client'

const { products } = schema

// From web/src/data/products.ts (products.id is a real uuid — no demo key needed, nothing references it)
const PRODUCTS = [
  {
    name: 'Beton Ready Mix K-300',
    unit: 'm3',
    status: 'active',
  },
  {
    name: 'Paving Block',
    unit: 'm2',
    status: 'active',
  },
  {
    name: 'Besi Beton 12mm',
    unit: 'batang',
    status: 'active',
  },
  {
    name: 'Semen',
    unit: 'sak',
    status: 'active',
  },
] as const

export async function seedProducts() {
  let total = 0
  for (const product of PRODUCTS) {
    const existing = await db.query.products.findFirst({
      where: (t, { eq }) => eq(t.name, product.name),
    })
    if (existing) {
      total++
      continue
    }
    await db.insert(products).values(product)
    total++
  }
  console.log(`  products: ${total} records`)
}
