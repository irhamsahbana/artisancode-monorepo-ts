import { desc, eq, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IBroadcastRepo } from '@/contracts/broadcast.contract'
import { broadcastLogs, broadcastTemplates } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

function templateToEntity(data: typeof broadcastTemplates.$inferSelect): Entity.BroadcastTemplate {
  return {
    id: data.id,
    name: data.name,
    message: data.message,
    occasion: data.occasion,
    audienceGender: data.audienceGender,
    audienceReligion: data.audienceReligion,
    audienceSegmentationId: data.audienceSegmentationId,
    audienceCustomerStatus: data.audienceCustomerStatus,
    scheduledAt: data.scheduledAt,
    sentAt: data.sentAt,
    status: data.status,
    createdAt: data.createdAt,
  }
}

function logToEntity(data: typeof broadcastLogs.$inferSelect): Entity.BroadcastLog {
  return {
    id: data.id,
    templateId: data.templateId,
    sentAt: data.sentAt,
    recipientCount: Number(data.recipientCount),
    status: data.status,
    recipientLogs: data.recipientLogs,
  }
}

export function createBroadcastRepo(): IBroadcastRepo {
  return {
    createTemplate: async (req) => {
      const [row] = await getExecutor()
        .insert(broadcastTemplates)
        .values({
          name: req.name,
          message: req.message,
          occasion: req.occasion,
          audienceGender: req.audienceGender,
          audienceReligion: req.audienceReligion,
          audienceSegmentationId: req.audienceSegmentationId,
          audienceCustomerStatus: req.audienceCustomerStatus,
          scheduledAt: req.scheduledAt ? new Date(req.scheduledAt) : null,
          status: req.scheduledAt ? 'scheduled' : 'draft',
        })
        .returning()
      return templateToEntity(row)
    },

    findTemplateList: async (page, perPage) => {
      const exec = getExecutor()
      const [items, countResult] = await Promise.all([
        exec
          .select()
          .from(broadcastTemplates)
          .orderBy(desc(broadcastTemplates.createdAt))
          .limit(perPage)
          .offset((page - 1) * perPage),
        exec.select({ count: sql<number>`count(*)::int` }).from(broadcastTemplates),
      ])

      const total = countResult[0]?.count ?? 0
      return {
        items: items.map(templateToEntity),
        pagination: { total, page, per_page: perPage, last_page: Math.ceil(total / perPage) },
      }
    },

    findLogs: async () => {
      const rows = await getExecutor()
        .select()
        .from(broadcastLogs)
        .orderBy(desc(broadcastLogs.sentAt))
      return rows.map(logToEntity)
    },

    findLogsByTemplateId: async (templateId) => {
      const rows = await getExecutor()
        .select()
        .from(broadcastLogs)
        .where(eq(broadcastLogs.templateId, templateId))
        .orderBy(desc(broadcastLogs.sentAt))
      return rows.map(logToEntity)
    },

    countLogsForTemplate: async (templateId) => {
      const [result] = await getExecutor()
        .select({ count: sql<number>`count(*)::int` })
        .from(broadcastLogs)
        .where(eq(broadcastLogs.templateId, templateId))
      return result?.count ?? 0
    },

    deleteTemplate: async (id) => {
      await getExecutor().delete(broadcastTemplates).where(eq(broadcastTemplates.id, id))
    },

    recordSend: async (templateId, recipientLogs) => {
      const exec = getExecutor()

      const sentCount = recipientLogs.filter((l) => l.status === 'sent').length
      const failedCount = recipientLogs.filter((l) => l.status === 'failed').length

      let overallStatus: 'pending' | 'sent' | 'failed' = 'pending'
      if (sentCount > 0) overallStatus = 'sent'
      else if (failedCount > 0) overallStatus = 'failed'

      const [logRow] = await exec
        .insert(broadcastLogs)
        .values({
          templateId,
          recipientCount: String(recipientLogs.length),
          status: overallStatus,
          recipientLogs,
        })
        .returning()

      await exec
        .update(broadcastTemplates)
        .set({ status: 'sent', sentAt: new Date() })
        .where(eq(broadcastTemplates.id, templateId))

      return logToEntity(logRow)
    },
  }
}
