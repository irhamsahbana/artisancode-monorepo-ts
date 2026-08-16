import * as schema from '../schema'
import { db } from './client'

const { quotations } = schema

// From web/src/data/quotations.ts (simplified to match schema)
// projectId dropped — this seeder doesn't create projects, and the column is nullable.
const QUOTATIONS = [
  {
    title: 'Penawaran Pembangunan Gedung 5 Lantai',
    topic: 'rfq',
    requesterName: 'Hendra Kusuma',
    companyName: 'PT Waskita Karya',
    whatsapp: '6281234567890',
    email: 'hendra@waskita.co.id',
    products: [
      {
        productName: 'Ready Mix Concrete K-300',
        specification: '30 MPa, slump 10±2 cm, aggregate 20mm',
        quantity: '500 m³',
      },
      {
        productName: 'Precast U-Box',
        specification: 'Panjang 2m, tinggi 40cm, lebar 50cm, beton K-400',
        quantity: '30 pcs',
      },
    ],
    notes: 'Butuh untuk proyek gedung 5 lantai di Surabaya',
    status: 'new',
  },
  {
    title: 'Penawaran Saluran U-Ditch',
    topic: 'permintaan penawaran',
    requesterName: 'Arif Rachman',
    companyName: 'PT Adhi Karya',
    whatsapp: '6282345678901',
    products: [
      {
        productName: 'Precast U-Box',
        specification: 'Panjang 2m, tinggi 40cm, lebar 50cm, beton K-400',
        quantity: '100 pcs',
      },
    ],
    status: 'in_review',
  },
  {
    title: 'Kebutuhan Cor Pribadi',
    topic: 'Penawaran harga beton untuk pribadi',
    requesterName: 'Ahmad Fauzi',
    whatsapp: '6283456789012',
    email: 'ahmad.fauzi@gmail.com',
    products: [
      {
        productName: 'Beton Cor Instansi',
        specification: 'K-250, ready mix, pompa beton tersedia',
        quantity: '200 m³',
      },
    ],
    notes: 'Lokasi proyek di Sidoarjo, akses truk mixer OK',
    status: 'responded',
  },
  {
    title: 'Penawaran Box Culvert Jalan Provinsi',
    requesterName: 'Dewi Sartika',
    companyName: 'PT Infrastruktur Indonesia',
    whatsapp: '6284567890123',
    products: [
      {
        productName: 'Box Culvert',
        specification: 'U-40/60/10, K-350, reinforcement sesuai SNI',
        quantity: '50 pcs',
      },
    ],
    notes: 'Butuh urgent untuk drainase jalan provinsi',
    status: 'new',
  },
  {
    title: 'Penawaran Batako / Concrete Block',
    requesterName: 'Rizky Pratama',
    whatsapp: '6285678901234',
    email: 'rizky.pratama@yahoo.com',
    products: [
      {
        productName: 'concrete Block',
        specification: '20x20x40 cm, hollow block, grade B',
        quantity: '2000 pcs',
      },
    ],
    status: 'in_review',
  },
] as const

export async function seedQuotations() {
  let total = 0
  for (const quotation of QUOTATIONS) {
    const existing = await db.query.quotations.findFirst({
      where: (t, { eq, and }) =>
        and(eq(t.title, quotation.title), eq(t.whatsapp, quotation.whatsapp)),
    })
    if (existing) {
      total++
      continue
    }
    await db.insert(quotations).values({ ...quotation, products: [...quotation.products] })
    total++
  }
  console.log(`  quotations: ${total} records`)
}
