import { IBirthdayGreetingRepo } from '@/contracts/birthday_greeting.contract'
import { birthdayGreetingLogs, birthdayGreetingSettings } from '@/db/schema'
import * as Entity from '@/entities/birthday_greeting.entity'

import { findBirthdayGreeting } from './birthday_greeting.repo/find'
import { findBirthdayGreetingLogs } from './birthday_greeting.repo/find-logs'
import { recordBirthdayGreetingSend } from './birthday_greeting.repo/record-send'
import { updateBirthdayGreeting } from './birthday_greeting.repo/update'

export interface BirthdayGreetingRepoDeps {
  settingsToEntity: (
    data: typeof birthdayGreetingSettings.$inferSelect,
  ) => Entity.BirthdayGreetingSettings
  logToEntity: (data: typeof birthdayGreetingLogs.$inferSelect) => Entity.BirthdayGreetingLog
}

function settingsToEntity(
  data: typeof birthdayGreetingSettings.$inferSelect,
): Entity.BirthdayGreetingSettings {
  return {
    id: data.id,
    message: data.message,
    enabled: data.enabled,
    audienceGender: data.audienceGender,
    audienceReligion: data.audienceReligion,
    audienceSegmentationId: data.audienceSegmentationId,
    audienceCustomerStatus: data.audienceCustomerStatus,
    updatedAt: data.updatedAt,
  }
}

function logToEntity(data: typeof birthdayGreetingLogs.$inferSelect): Entity.BirthdayGreetingLog {
  return {
    id: data.id,
    sentAt: data.sentAt,
    recipientCount: Number(data.recipientCount),
    recipientLogs: data.recipientLogs,
  }
}

export function createBirthdayGreetingRepo(): IBirthdayGreetingRepo {
  const deps: BirthdayGreetingRepoDeps = {
    settingsToEntity,
    logToEntity,
  }

  return {
    find: () => findBirthdayGreeting(deps),
    update: (req) => updateBirthdayGreeting(deps, req),
    findLogs: () => findBirthdayGreetingLogs(deps),
    recordSend: (recipientLogs) => recordBirthdayGreetingSend(deps, recipientLogs),
  }
}

export default createBirthdayGreetingRepo
