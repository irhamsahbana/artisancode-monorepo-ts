import { eq } from 'drizzle-orm'

import * as schema from '../schema'
import { db } from './client'

const { contacts, customers } = schema

// From web/src/data/contacts.ts (simplified to match schema)
// `customerId` is a demo key resolved against the customer map, not a literal
// DB value. `id` is only used within this file to build the returned map.
const CONTACTS = [
  {
    id: 'con1',
    customerId: 'c1',
    name: 'Hendra Wijaya',
    position: 'Direktur',
    whatsapp: '628111234567',
    email: 'hendra@majubersama.co.id',
    isPrimary: true,
    notes: 'Suka golf tiap Sabtu pagi, ramah tapi tegas soal harga.',
  },
  {
    id: 'con2',
    customerId: 'c1',
    name: 'Dewi Kusuma',
    position: 'Manager Keuangan',
    whatsapp: '628112222222',
    email: 'dewi@majubersama.co.id',
    isPrimary: false,
    notes: 'Detail soal administrasi, minta invoice selalu lengkap.',
  },
  {
    id: 'con3',
    customerId: 'c2',
    name: 'Andi Saputra',
    position: 'CEO',
    whatsapp: '628221234567',
    email: 'andi@teknologinusantara.id',
    isPrimary: true,
  },
  {
    id: 'con4',
    customerId: 'c4',
    name: 'Rini Susanti',
    position: 'HRD Manager',
    whatsapp: '628441234567',
    email: 'rini@anekacorp.com',
    isPrimary: true,
  },
  {
    id: 'con5',
    customerId: 'c5',
    name: 'Bapak Suroto',
    position: 'Kepala Dinas',
    isPrimary: true,
  },
  {
    id: 'con6',
    customerId: 'c6',
    name: 'Kevin Pratama',
    position: 'Co-Founder',
    whatsapp: '628661234567',
    email: 'kevin@innovasi.id',
    isPrimary: true,
  },
  {
    id: 'con7',
    customerId: 'c8',
    name: 'Ibu Hartini',
    position: 'Sekretaris',
    isPrimary: true,
  },
  {
    id: 'con8',
    customerId: 'c9',
    name: 'Ir. Bambang S.',
    position: 'Direktur Utama',
    whatsapp: '628991234567',
    email: 'bambang@megakons.co.id',
    isPrimary: true,
  },
  {
    id: 'con9',
    customerId: 'c9',
    name: 'Andi Saputra',
    position: 'Konsultan Proyek',
    whatsapp: '628221234567',
    email: 'andi@megakons.co.id',
    isPrimary: false,
  },
  {
    id: 'con10',
    customerId: 'c6',
    name: 'Rini Susanti',
    position: 'Advisor',
    whatsapp: '628441234567',
    email: 'rini@innovasi.id',
    isPrimary: false,
  },
  {
    id: 'con11',
    customerId: 'c2',
    name: 'Hendra Wijaya',
    position: 'Komisaris',
    whatsapp: '628111234567',
    email: 'hendra@teknologinusantara.id',
    isPrimary: false,
  },
  {
    id: 'con12',
    customerId: 'c3',
    name: 'Budi Santoso',
    position: 'Pemilik',
    whatsapp: '628331234567',
    isPrimary: true,
  },
  {
    id: 'con13',
    customerId: 'c7',
    name: 'Siti Rahayu',
    position: 'Pemilik',
    whatsapp: '628771234567',
    isPrimary: true,
  },
  {
    id: 'con14',
    customerId: 'c10',
    name: 'Ahmad Fauzi',
    position: 'Direktur',
    isPrimary: true,
  },
]

export async function seedContacts(customerIds: Map<string, string>) {
  const contactIds = new Map<string, string>()
  let total = 0

  for (const { id: demoId, customerId: demoCustomerId, isPrimary, ...contact } of CONTACTS) {
    const customerId = customerIds.get(demoCustomerId)
    if (!customerId) {
      console.log(`  Skipping contact "${contact.name}" - customer ${demoCustomerId} not found`)
      continue
    }

    const existing = await db.query.contacts.findFirst({
      where: (t, { and }) => and(eq(t.customerId, customerId), eq(t.name, contact.name)),
    })
    const contactId = existing
      ? existing.id
      : (
          await db
            .insert(contacts)
            .values({ ...contact, customerId, isPrimary })
            .returning()
        )[0].id
    contactIds.set(demoId, contactId)

    if (isPrimary) {
      await db
        .update(customers)
        .set({ primaryContactId: contactId })
        .where(eq(customers.id, customerId))
    }
    total++
  }

  console.log(`  contacts: ${total} records`)
  return contactIds
}
