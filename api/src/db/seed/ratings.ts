import { eq } from 'drizzle-orm'

import * as schema from '../schema'
import { db } from './client'

const { customerRatings } = schema

// From web/src/data/ratings.ts (simplified to match schema)
const RATINGS = [
  {
    customerId: 'c1',
    contactId: 'con1',
    ratingDate: '2026-05-10',
    paymentScore: '5',
    relationshipScore: '4',
    riskLevel: 'low',
    notes: 'Pembayaran selalu tepat waktu, hubungan baik.',
  },
  {
    customerId: 'c1',
    contactId: 'con1',
    ratingDate: '2026-02-15',
    paymentScore: '4',
    relationshipScore: '4',
    riskLevel: 'low',
    notes: 'Penilaian triwulan sebelumnya.',
  },
  {
    customerId: 'c2',
    ratingDate: '2026-06-01',
    paymentScore: '2',
    relationshipScore: '3',
    problemNotes: 'Sering telat bayar 30+ hari.',
    riskLevel: 'high',
    notes: 'Perlu follow-up intensif.',
  },
  {
    customerId: 'c5',
    ratingDate: '2026-04-20',
    paymentScore: '3',
    relationshipScore: '3',
    riskLevel: 'medium',
  },
  {
    customerId: 'c6',
    ratingDate: '2026-06-12',
    paymentScore: '5',
    relationshipScore: '5',
    riskLevel: 'low',
    notes: 'Pelanggan ideal.',
  },
  {
    customerId: 'c9',
    ratingDate: '2026-03-08',
    paymentScore: '4',
    relationshipScore: '2',
    riskLevel: 'medium',
    notes: 'Komplain kecil terkait pengiriman.',
  },
  {
    customerId: 'c10',
    ratingDate: '2026-05-25',
    paymentScore: '3',
    relationshipScore: '4',
    riskLevel: 'low',
  },
] as const

export async function seedRatings(
  customerIds: Map<string, string>,
  contactIds: Map<string, string>,
) {
  let total = 0
  for (const { customerId: demoCustomerId, ...rating } of RATINGS) {
    const customerId = customerIds.get(demoCustomerId)
    if (!customerId) {
      console.log(`  Skipping rating - customer ${demoCustomerId} not found`)
      continue
    }
    const demoContactId = 'contactId' in rating ? rating.contactId : undefined
    const contactId = demoContactId ? contactIds.get(demoContactId) : undefined

    const existing = await db.query.customerRatings.findFirst({
      where: (t, { and }) => and(eq(t.customerId, customerId), eq(t.ratingDate, rating.ratingDate)),
    })
    if (existing) {
      total++
      continue
    }
    await db.insert(customerRatings).values({ ...rating, customerId, contactId })
    total++
  }
  console.log(`  ratings: ${total} records`)
}
