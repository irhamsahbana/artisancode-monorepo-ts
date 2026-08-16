import * as schema from '../schema'
import { db } from './client'

const { customers } = schema

// From web/src/data/customers.ts
// `id`/`segmentationId`/`areaId` are demo keys resolved against the category
// map, not literal DB values (customers.id is a real uuid). `primaryContactId`
// is linked separately once contacts exist — see seedContacts.
const CUSTOMERS = [
  {
    id: 'c1',
    name: 'PT Maju Bersama',
    segmentationId: 'seg2',
    areaId: 'area1',
    type: 'business',
    status: 'active',
    potential: 'high',
    address: 'Jl. Sudirman Kav. 45, Jakarta Selatan',
    npwp: '01.234.567.8-901.000',
    skt: 'SKT-2023-001234',
    companyEmail: 'info@majubersama.co.id',
    website: 'https://majubersama.co.id',
    notes: 'Klien lama, loyal.',
  },
  {
    id: 'c2',
    name: 'CV Teknologi Nusantara',
    segmentationId: 'seg1',
    areaId: 'area3',
    type: 'business',
    status: 'active',
    potential: 'medium',
    address: 'Jl. Asia Afrika No. 12, Bandung',
    npwp: '02.345.678.9-012.000',
    companyEmail: 'contact@teknologinusantara.id',
  },
  {
    id: 'c3',
    name: 'CV Karya Mandiri',
    segmentationId: 'seg1',
    areaId: 'area2',
    type: 'business',
    status: 'prospect',
    potential: 'medium',
    address: 'Jl. Panjang No. 8, Jakarta Barat',
    notes: 'Proyek kecil rumah tinggal.',
  },
  {
    id: 'c4',
    name: 'PT Aneka Solusi Digital',
    segmentationId: 'seg3',
    areaId: 'area1',
    type: 'business',
    status: 'prospect',
    potential: 'high',
    address: 'Jl. HR Rasuna Said, Jakarta Selatan',
    npwp: '03.456.789.0-123.000',
    companyEmail: 'hello@anekacorp.com',
    website: 'https://anekacorp.com',
  },
  {
    id: 'c5',
    name: 'Dinas Pendidikan Kota Bandung',
    segmentationId: 'seg2',
    areaId: 'area3',
    type: 'business',
    status: 'inactive',
    potential: 'medium',
    address: 'Jl. Ambon No. 1, Bandung',
  },
  {
    id: 'c6',
    name: 'Startup Inovasi Indonesia',
    segmentationId: 'seg4',
    areaId: 'area5',
    type: 'business',
    status: 'active',
    potential: 'high',
    address: 'Jl. Kaliurang KM 5, Yogyakarta',
    npwp: '04.567.890.1-234.000',
    companyEmail: 'team@innovasi.id',
    website: 'https://innovasi.id',
  },
  {
    id: 'c7',
    name: 'UD Sumber Rejeki',
    segmentationId: 'seg5',
    areaId: 'area4',
    type: 'business',
    status: 'active',
    potential: 'low',
    address: 'Jl. Kertajaya No. 20, Surabaya',
  },
  {
    id: 'c8',
    name: 'Yayasan Peduli Bangsa',
    segmentationId: 'seg1',
    areaId: 'area1',
    type: 'business',
    status: 'prospect',
    potential: 'medium',
    address: 'Jl. Cikini Raya No. 5, Jakarta Pusat',
  },
  {
    id: 'c9',
    name: 'PT Mega Konstruksi',
    segmentationId: 'seg3',
    areaId: 'area4',
    type: 'business',
    status: 'active',
    potential: 'high',
    address: 'Jl. Basuki Rahmat No. 100, Surabaya',
    npwp: '05.678.901.2-345.000',
    skt: 'SKT-2020-005678',
    companyEmail: 'corporate@megakons.co.id',
    website: 'https://megakons.co.id',
  },
  {
    id: 'c10',
    name: 'PT Fauzi Bangun Perkasa',
    segmentationId: 'seg5',
    areaId: 'area2',
    type: 'business',
    status: 'inactive',
    potential: 'low',
    address: 'Jl. Daan Mogot No. 30, Jakarta Barat',
  },
] as const

export async function seedCustomers(categoryIds: Map<string, string>) {
  const customerIds = new Map<string, string>()

  for (const { id: demoId, segmentationId, areaId, ...customer } of CUSTOMERS) {
    const existing = await db.query.customers.findFirst({
      where: (t, { eq }) => eq(t.name, customer.name),
    })
    if (existing) {
      customerIds.set(demoId, existing.id)
      continue
    }
    const [row] = await db
      .insert(customers)
      .values({
        ...customer,
        segmentationId: categoryIds.get(segmentationId),
        areaId: categoryIds.get(areaId),
      })
      .returning()
    customerIds.set(demoId, row.id)
  }

  console.log(`  customers: ${customerIds.size} records`)
  return customerIds
}
