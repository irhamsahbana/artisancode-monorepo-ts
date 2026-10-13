import { IBroadcastRepo } from '@/contracts/broadcast.contract'
import { broadcastLogs, broadcastTemplates } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

import { countLogsForTemplate } from './broadcast.repo/count-logs-for-template'
import { createBroadcastTemplate } from './broadcast.repo/create-template'
import { deleteBroadcastTemplate } from './broadcast.repo/delete-template'
import { findBroadcastLogs } from './broadcast.repo/find-logs'
import { findBroadcastLogsByTemplateId } from './broadcast.repo/find-logs-by-template-id'
import { findBroadcastTemplateList } from './broadcast.repo/find-template-list'
import { recordBroadcastSend } from './broadcast.repo/record-send'

export interface BroadcastRepoDeps {
  templateToEntity: (data: typeof broadcastTemplates.$inferSelect) => Entity.BroadcastTemplate
  logToEntity: (data: typeof broadcastLogs.$inferSelect) => Entity.BroadcastLog
}

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
  const deps: BroadcastRepoDeps = {
    templateToEntity,
    logToEntity,
  }

  return {
    createTemplate: (req) => createBroadcastTemplate(deps, req),
    findTemplateList: (page, perPage) => findBroadcastTemplateList(deps, page, perPage),
    findLogs: () => findBroadcastLogs(deps),
    findLogsByTemplateId: (templateId) => findBroadcastLogsByTemplateId(deps, templateId),
    countLogsForTemplate: (templateId) => countLogsForTemplate(templateId),
    deleteTemplate: (id) => deleteBroadcastTemplate(id),
    recordSend: (templateId, recipientLogs) => recordBroadcastSend(deps, templateId, recipientLogs),
  }
}

export default createBroadcastRepo
