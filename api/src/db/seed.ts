/**
 * Database seeder — run with: bun src/db/seed.ts
 *
 * Seeds: business profile → permissions → role → user → master items → customers → contacts → products → projects → quotations → ratings → broadcasts
 * Safe to re-run: skips existing records by checking unique columns.
 *
 * Updated to use same data as frontend demo (web/src/data/*)
 */
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { hashPassword } from '@/common/encryption'

import * as schema from './schema'

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

const {
  businessProfiles,
  roles,
  users,
  categories,
  customers,
  contacts,
  permissions,
  rolePermissions,
  products,
  quotations,
  customerRatings,
  broadcastTemplates,
  broadcastLogs,
} = schema

// ---------------------------------------------------------------------------
// DB connection (standalone — does not go through the app's singleton)
// ---------------------------------------------------------------------------
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL env var is not set')

const client = postgres(DATABASE_URL, { max: 1 })
const db = drizzle(client, { schema })

// ---------------------------------------------------------------------------
// Seed data definitions (from web/src/data/*)
// ---------------------------------------------------------------------------

const BUSINESS_NAME = 'PT Wika CRM Demo'
const ADMIN_EMAIL = 'admin@wika.demo'
const ADMIN_PASSWORD = 'password123'
const ADMIN_USERNAME = 'admin'

// From web/src/data/master.ts
const MASTER_DATA = {
  segmentation: [
    {
      id: 'seg1',
      name: 'UMKM',
      status: 'active',
    },
    {
      id: 'seg2',
      name: 'Korporat',
      status: 'active',
    },
    {
      id: 'seg3',
      name: 'Enterprise',
      status: 'active',
    },
    {
      id: 'seg4',
      name: 'Startup',
      status: 'active',
    },
    {
      id: 'seg5',
      name: 'Freelancer',
      status: 'inactive',
    },
  ],
  area: [
    {
      id: 'area1',
      name: 'Jakarta Selatan',
      status: 'active',
    },
    {
      id: 'area2',
      name: 'Jakarta Barat',
      status: 'active',
    },
    {
      id: 'area3',
      name: 'Bandung',
      status: 'active',
    },
    {
      id: 'area4',
      name: 'Surabaya',
      status: 'active',
    },
    {
      id: 'area5',
      name: 'Yogyakarta',
      status: 'active',
    },
    {
      id: 'area6',
      name: 'Medan',
      status: 'inactive',
    },
  ],
  relation_status: [
    {
      id: 'rs1',
      name: 'Prospek',
      status: 'active',
    },
    {
      id: 'rs2',
      name: 'Aktif',
      status: 'active',
    },
    {
      id: 'rs3',
      name: 'Tidak Aktif',
      status: 'active',
    },
    {
      id: 'rs4',
      name: 'Blacklist',
      status: 'inactive',
    },
  ],
}

// From web/src/data/contacts.ts (simplified to match schema)
const CONTACTS = [
  {
    customerId: 'c1',
    name: 'Hendra Wijaya',
    position: 'Direktur',
    whatsapp: '628111234567',
    email: 'hendra@majubersama.co.id',
    isPrimary: true,
    notes: 'Suka golf tiap Sabtu pagi, ramah tapi tegas soal harga.',
  },
  {
    customerId: 'c1',
    name: 'Dewi Kusuma',
    position: 'Manager Keuangan',
    whatsapp: '628112222222',
    email: 'dewi@majubersama.co.id',
    isPrimary: false,
    notes: 'Detail soal administrasi, minta invoice selalu lengkap.',
  },
  {
    customerId: 'c2',
    name: 'Andi Saputra',
    position: 'CEO',
    whatsapp: '628221234567',
    email: 'andi@teknologinusantara.id',
    isPrimary: true,
  },
  {
    customerId: 'c4',
    name: 'Rini Susanti',
    position: 'HRD Manager',
    whatsapp: '628441234567',
    email: 'rini@anekacorp.com',
    isPrimary: true,
  },
  {
    customerId: 'c5',
    name: 'Bapak Suroto',
    position: 'Kepala Dinas',
    isPrimary: true,
  },
  {
    customerId: 'c6',
    name: 'Kevin Pratama',
    position: 'Co-Founder',
    whatsapp: '628661234567',
    email: 'kevin@innovasi.id',
    isPrimary: true,
  },
  {
    customerId: 'c8',
    name: 'Ibu Hartini',
    position: 'Sekretaris',
    isPrimary: true,
  },
  {
    customerId: 'c9',
    name: 'Ir. Bambang S.',
    position: 'Direktur Utama',
    whatsapp: '628991234567',
    email: 'bambang@megakons.co.id',
    isPrimary: true,
  },
  {
    customerId: 'c9',
    name: 'Andi Saputra',
    position: 'Konsultan Proyek',
    whatsapp: '628221234567',
    email: 'andi@megakons.co.id',
    isPrimary: false,
  },
  {
    customerId: 'c6',
    name: 'Rini Susanti',
    position: 'Advisor',
    whatsapp: '628441234567',
    email: 'rini@innovasi.id',
    isPrimary: false,
  },
  {
    customerId: 'c2',
    name: 'Hendra Wijaya',
    position: 'Komisaris',
    whatsapp: '628111234567',
    email: 'hendra@teknologinusantara.id',
    isPrimary: false,
  },
  {
    customerId: 'c3',
    name: 'Budi Santoso',
    position: 'Pemilik',
    whatsapp: '628331234567',
    isPrimary: true,
  },
  {
    customerId: 'c7',
    name: 'Siti Rahayu',
    position: 'Pemilik',
    whatsapp: '628771234567',
    isPrimary: true,
  },
  {
    customerId: 'c10',
    name: 'Ahmad Fauzi',
    position: 'Direktur',
    isPrimary: true,
  },
]

// From web/src/data/products.ts
const PRODUCTS = [
  {
    id: 'prod1',
    name: 'Beton Ready Mix K-300',
    unit: 'm3',
    status: 'active',
  },
  {
    id: 'prod2',
    name: 'Paving Block',
    unit: 'm2',
    status: 'active',
  },
  {
    id: 'prod3',
    name: 'Besi Beton 12mm',
    unit: 'batang',
    status: 'active',
  },
  {
    id: 'prod4',
    name: 'Semen',
    unit: 'sak',
    status: 'active',
  },
]

// From web/src/data/quotations.ts (simplified to match schema)
const QUOTATIONS = [
  {
    id: 'q1',
    title: 'Penawaran Pembangunan Gedung 5 Lantai',
    projectId: 'p13',
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
    id: 'q2',
    title: 'Penawaran Saluran U-Ditch',
    projectId: 'p8',
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
    id: 'q3',
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
    id: 'q4',
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
    id: 'q5',
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
]

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
]

// From web/src/data/broadcasts.ts (simplified to match schema)
const BROADCAST_TEMPLATES = [
  {
    id: 'b1',
    name: 'Ucapan Idul Fitri 1446 H',
    message:
      'Taqabbalallahu minna wa minkum. Selamat Hari Raya Idul Fitri 1446 H. Mohon maaf lahir dan batin. Semoga kita tetap sehat dan sukses bersama.',
    occasion: 'idul_fitri',
    audienceReligion: 'Islam',
    status: 'draft',
  },
  {
    id: 'b2',
    name: 'Promo Natal',
    message:
      'Selamat Natal! Dapatkan promo khusus untuk pemesanan ready mix. Hubungi kami untuk detail.',
    occasion: 'christmas',
    audienceReligion: 'Kristen',
    audienceCustomerStatus: 'active',
    status: 'scheduled',
    scheduledAt: '2026-12-24T09:00:00.000Z',
  },
  {
    id: 'b3',
    name: 'Hari Kemerdekaan RI',
    message:
      'Dirgahayu RI! 🇮🇩 Mari bangun negeri dengan beton berkualitas. Dukung proyek infrastruktur Indonesia dengan produk precast terbaik.',
    occasion: 'national_day',
    status: 'sent',
    sentAt: '2026-08-17T08:00:00.000Z',
  },
]

const BROADCAST_LOGS = [
  {
    id: 'l1',
    templateId: 'b1',
    sentAt: '2026-07-19T10:30:00.000Z',
    recipientCount: '0',
    status: 'pending',
  },
  {
    id: 'l2',
    templateId: 'b3',
    sentAt: '2026-08-17T08:00:00.000Z',
    recipientCount: '5',
    status: 'sent',
  },
]

// Permission label lookup: "customers.view" → "Pelanggan: Lihat"
const MODULE_LABELS = new Map<string, string>(PERMISSION_MODULES.map((m) => [m.key, m.label]))
const ACTION_LABELS = new Map<string, string>(PERMISSION_ACTIONS.map((a) => [a.key, a.label]))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function upsertBusinessProfile() {
  const existing = await db.query.businessProfiles.findFirst()
  if (existing) {
    console.log(`  business profile exists: ${existing.id}`)
    return existing
  }
  const [row] = await db
    .insert(businessProfiles)
    .values({
      name: BUSINESS_NAME,
      businessType: 'Konstruksi & Infrastruktur',
      phone: '02150123456',
      email: 'info@wika.demo',
      address: 'Jl. Gatot Subroto No. 40, Jakarta Selatan',
    })
    .returning()
  console.log(`  business profile created: ${row.id}`)
  return row
}

async function upsertPermissions() {
  const ids: string[] = []

  for (const name of PERMISSIONS) {
    const existing = await db.query.permissions.findFirst({
      where: (t, { eq, isNull }) => and(eq(t.name, name), isNull(t.deletedAt)),
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

async function upsertRole(permissionIds: string[]) {
  const existing = await db.query.roles.findFirst({
    where: (t, { eq, isNull }) => and(eq(t.name, 'Admin'), isNull(t.deletedAt)),
  })
  const role =
    existing ??
    (
      await db
        .insert(roles)
        .values({ name: 'Admin', description: 'Full access administrator' })
        .returning()
    )[0]
  if (existing) {
    console.log(`  role exists: ${existing.id}`)
  } else {
    console.log(`  role created: ${role.id}`)
  }

  // Link all permissions to Admin (skip already-linked rows so re-runs are safe)
  const linked = await db
    .select({ permissionId: rolePermissions.permissionId })
    .from(rolePermissions)
    .where(eq(rolePermissions.roleId, role.id))
  const linkedIds = new Set(linked.map((rp) => rp.permissionId))
  const toInsert = permissionIds.filter((id) => !linkedIds.has(id))
  if (toInsert.length > 0) {
    await db
      .insert(rolePermissions)
      .values(toInsert.map((permissionId) => ({ roleId: role.id, permissionId })))
  }
  console.log(`  role_permissions: ${toInsert.length} linked (${linkedIds.size} already existed)`)

  return role
}

async function upsertAdminUser(roleId: string) {
  const existing = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.email, ADMIN_EMAIL),
  })
  if (existing) {
    console.log(`  user exists: ${existing.id}`)
    return existing
  }
  const [row] = await db
    .insert(users)
    .values({
      roleId,
      name: 'Administrator',
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: await hashPassword(ADMIN_PASSWORD),
      phone: '081200000000',
    })
    .returning()
  console.log(`  user created: ${row.id} (email: ${ADMIN_EMAIL}, password: ${ADMIN_PASSWORD})`)
  return row
}

async function seedMasterItems() {
  const ids: Record<string, string[]> = {
    segmentation: [],
    area: [],
    relation_status: [],
  }

  for (const [group, items] of Object.entries(MASTER_DATA)) {
    for (const item of items) {
      const existing = await db.query.categories.findFirst({
        where: (t, { eq, and, isNull }) =>
          and(eq(t.group, group), eq(t.name, item.name), isNull(t.deletedAt)),
      })
      if (existing) {
        ids[group].push(existing.id)
        continue
      }
      const [row] = await db
        .insert(categories)
        .values({ group, name: item.name, status: item.status })
        .returning()
      ids[group].push(row.id)
    }
    console.log(`  categories[${group}]: ${ids[group].length} records`)
  }

  return ids
}

async function seedCustomers() {
  const customerIds: string[] = []

  for (const customer of [
    {
      id: 'c1',
      name: 'PT Maju Bersama',
      segmentationId: 'seg2',
      areaId: 'area1',
      type: 'business',
      status: 'active',
      potential: 'high',
      primaryContactId: 'con1',
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
      primaryContactId: 'con3',
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
      primaryContactId: 'con13',
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
      primaryContactId: 'con4',
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
      primaryContactId: 'con5',
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
      primaryContactId: 'con6',
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
      primaryContactId: 'con14',
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
      primaryContactId: 'con8',
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
      primaryContactId: 'con9',
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
      primaryContactId: 'con15',
      address: 'Jl. Daan Mogot No. 30, Jakarta Barat',
    },
  ]) {
    const existing = await db.query.customers.findFirst({
      where: (t, { eq }) => eq(t.id, customer.id),
    })
    if (existing) {
      customerIds.push(existing.id)
      continue
    }
    const [row] = await db.insert(customers).values(customer).returning()
    customerIds.push(row.id)
  }

  console.log(`  customers: ${customerIds.length} records`)
  return customerIds
}

async function seedContacts(customerIds: string[]) {
  let total = 0
  for (const contact of CONTACTS) {
    const customer = customer.customerId
    // Verify customer exists before creating contact
    if (!customerIds.includes(customer)) {
      console.log(`  Skipping contact "${contact.name}" - customer ${customer} not found`)
      continue
    }

    const existing = await db.query.contacts.findFirst({
      where: (t, { and }) =>
        and(eq(t.customerId, customer), eq(t.name, contact.name)),
    })
    if (existing) {
      total++
      continue
    }
    await db.insert(contacts).values(contact)
    total++
  }
  console.log(`  contacts: ${total} records`)
}

async function seedProducts() {
  let total = 0
  for (const product of PRODUCTS) {
    const existing = await db.query.products.findFirst({
      where: (t, { eq }) => eq(t.id, product.id),
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

async function seedQuotations() {
  let total = 0
  for (const quotation of QUOTATIONS) {
    const existing = await db.query.quotations.findFirst({
      where: (t, { eq }) => eq(t.id, quotation.id),
    })
    if (existing) {
      total++
      continue
    }
    await db.insert(quotations).values(quotation)
    total++
  }
  console.log(`  quotations: ${total} records`)
}

async function seedRatings() {
  let total = 0
  for (const rating of RATINGS) {
    const existing = await db.query.customerRatings.findFirst({
      where: (t, { and }) =>
        and(eq(t.customerId, rating.customerId), eq(t.ratingDate, rating.ratingDate)),
    })
    if (existing) {
      total++
      continue
    }
    await db.insert(customerRatings).values(rating)
    total++
  }
  console.log(`  ratings: ${total} records`)
}

async function seedBroadcasts() {
  let templatesTotal = 0
  for (const template of BROADCAST_TEMPLATES) {
    const existing = await db.query.broadcastTemplates.findFirst({
      where: (t, { eq }) => eq(t.id, template.id),
    })
    if (existing) {
      templatesTotal++
      continue
    }
    await db.insert(broadcastTemplates).values(template)
    templatesTotal++
  }
  console.log(`  broadcast_templates: ${templatesTotal} records`)

  let logsTotal = 0
  for (const log of BROADCAST_LOGS) {
    const existing = await db.query.broadcastLogs.findFirst({
      where: (t, { eq }) => eq(t.id, log.id),
    })
    if (existing) {
      logsTotal++
      continue
    }
    await db.insert(broadcastLogs).values(log)
    logsTotal++
  }
  console.log(`  broadcast_logs: ${logsTotal} records`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Seeding database...')

  console.log('\n[1/10] Business profile')
  await upsertBusinessProfile()

  console.log('\n[2/10] Permissions')
  const permissionIds = await upsertPermissions()

  console.log('\n[3/10] Role')
  const role = await upsertRole(permissionIds)

  console.log('\n[4/10] Admin user')
  await upsertAdminUser(role.id)

  console.log('\n[5/10] Master items')
  await seedMasterItems()

  console.log('\n[6/10] Customers')
  const customerIds = await seedCustomers()

  console.log('\n[7/10] Contacts')
  await seedContacts(customerIds)

  console.log('\n[8/10] Products')
  await seedProducts()

  console.log('\n[9/10] Quotations')
  await seedQuotations()

  console.log('\n[10/10] Ratings')
  await seedRatings()

  console.log('\n[11/11] Broadcasts')
  await seedBroadcasts()

  console.log('\nDone.')
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})