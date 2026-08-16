import { AppError, ErrorCode } from '@artisancode/types'
import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IBroadcastRepo, IBroadcastUsecase } from '@/contracts/broadcast.contract'
import { contacts, customers } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

export interface BroadcastUsecaseDeps {
  repo: IBroadcastRepo
}

export function createBroadcastUsecase(repo: IBroadcastRepo): IBroadcastUsecase {
  const deps: BroadcastUsecaseDeps = { repo }

  return {
    createTemplate: (req) => deps.repo.createTemplate(req),
    findTemplateList: (page, perPage) => deps.repo.findTemplateList(page, perPage),
    findLogs: () => deps.repo.findLogs(),
    findLogsByTemplateId: (templateId) => deps.repo.findLogsByTemplateId(templateId),

    send: async (req) => {
      const exec = getExecutor()

      // 1. Fetch template to get audience criteria
      const template = await exec.query.broadcastTemplates.findFirst({
        where: (t, { eq }) => eq(t.id, req.templateId),
      })

      if (!template) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Broadcast template not found')
      }
      if (template.status === 'sent') {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Broadcast already sent')
      }

      // 2. Query target audience based on criteria
      const conditions = [isNull(contacts.deletedAt), isNull(customers.deletedAt)]

      if (template.audienceGender) {
        conditions.push(eq(customers.gender, template.audienceGender))
      }
      if (template.audienceReligion) {
        conditions.push(eq(customers.religion, template.audienceReligion))
      }
      if (template.audienceSegmentationId) {
        conditions.push(eq(customers.segmentationId, template.audienceSegmentationId))
      }
      if (template.audienceCustomerStatus) {
        conditions.push(
          eq(
            customers.status,
            template.audienceCustomerStatus as 'prospect' | 'active' | 'inactive',
          ),
        )
      }

      const targetContacts = await exec
        .select({
          contactId: contacts.id,
          contactName: contacts.name,
          whatsapp: contacts.whatsapp,
        })
        .from(contacts)
        .innerJoin(customers, eq(contacts.customerId, customers.id))
        .where(and(...conditions))

      if (targetContacts.length === 0) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'No contacts match the audience criteria')
      }

      // 3. No-op execution (simulate sending via provider)
      const recipientLogs: Entity.PerContactLog[] = targetContacts.map((c) => {
        // Skip those without whatsapp
        if (!c.whatsapp) {
          return {
            contactId: c.contactId,
            contactName: c.contactName,
            status: 'failed',
            errorMessage: 'Missing WhatsApp number',
          }
        }

        // Simulate success for now
        return {
          contactId: c.contactId,
          contactName: c.contactName,
          status: 'sent',
          sentAt: new Date().toISOString(),
        }
      })

      // 4. Record results
      return deps.repo.recordSend(req.templateId, recipientLogs)
    },
  }
}
