import * as schema from '../schema'
import { db } from './client'

const { broadcastTemplates, broadcastLogs } = schema

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
    scheduledAt: new Date('2026-12-24T09:00:00.000Z'),
  },
  {
    id: 'b3',
    name: 'Hari Kemerdekaan RI',
    message:
      'Dirgahayu RI! 🇮🇩 Mari bangun negeri dengan beton berkualitas. Dukung proyek infrastruktur Indonesia dengan produk precast terbaik.',
    occasion: 'national_day',
    status: 'sent',
    sentAt: new Date('2026-08-17T08:00:00.000Z'),
  },
] as const

const BROADCAST_LOGS = [
  {
    id: 'l1',
    templateId: 'b1',
    sentAt: new Date('2026-07-19T10:30:00.000Z'),
    recipientCount: '0',
    status: 'pending',
  },
  {
    id: 'l2',
    templateId: 'b3',
    sentAt: new Date('2026-08-17T08:00:00.000Z'),
    recipientCount: '5',
    status: 'sent',
  },
] as const

export async function seedBroadcasts() {
  const templateIds = new Map<string, string>()
  let templatesTotal = 0
  for (const { id: demoId, ...template } of BROADCAST_TEMPLATES) {
    const existing = await db.query.broadcastTemplates.findFirst({
      where: (t, { eq }) => eq(t.name, template.name),
    })
    const templateId = existing
      ? existing.id
      : (await db.insert(broadcastTemplates).values(template).returning())[0].id
    templateIds.set(demoId, templateId)
    templatesTotal++
  }
  console.log(`  broadcast_templates: ${templatesTotal} records`)

  let logsTotal = 0
  for (const log of BROADCAST_LOGS) {
    const templateId = templateIds.get(log.templateId)
    if (!templateId) {
      console.log(`  Skipping broadcast log - template ${log.templateId} not found`)
      continue
    }
    const existing = await db.query.broadcastLogs.findFirst({
      where: (t, { eq, and }) => and(eq(t.templateId, templateId), eq(t.sentAt, log.sentAt)),
    })
    if (existing) {
      logsTotal++
      continue
    }
    await db.insert(broadcastLogs).values({
      templateId,
      sentAt: log.sentAt,
      recipientCount: log.recipientCount,
      status: log.status,
    })
    logsTotal++
  }
  console.log(`  broadcast_logs: ${logsTotal} records`)
}
