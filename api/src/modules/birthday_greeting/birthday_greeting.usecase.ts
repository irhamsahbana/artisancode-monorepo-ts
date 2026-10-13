import {
  IBirthdayGreetingRepo,
  IBirthdayGreetingUsecase,
} from '@/contracts/birthday_greeting.contract'
import * as Entity from '@/entities/birthday_greeting.entity'

import { findBirthdayGreeting } from './birthday_greeting.usecase/find'
import { findBirthdayGreetingLogs } from './birthday_greeting.usecase/find-logs'
import { updateBirthdayGreeting } from './birthday_greeting.usecase/update'

const DEFAULT_MESSAGE =
  'Selamat Ulang Tahun {{sapaan}} {{nama}}! 🎉\n\nSemoga selalu diberikan kesehatan, kebahagiaan, dan kesuksesan. Terima kasih atas kepercayaan Anda bersama CRM Wika.'

// Virtual defaults so the settings page always has something to render and
// save against, even before the first PATCH ever creates the row.
const DEFAULT_SETTINGS: Entity.BirthdayGreetingSettings = {
  id: '',
  message: DEFAULT_MESSAGE,
  enabled: false,
  audienceGender: null,
  audienceReligion: null,
  audienceSegmentationId: null,
  audienceCustomerStatus: null,
  updatedAt: new Date(0),
}

export interface BirthdayGreetingUsecaseDeps {
  repo: IBirthdayGreetingRepo
  defaultSettings: Entity.BirthdayGreetingSettings
}

export function createBirthdayGreetingUsecase(
  repo: IBirthdayGreetingRepo,
): IBirthdayGreetingUsecase {
  const deps: BirthdayGreetingUsecaseDeps = {
    repo,
    defaultSettings: DEFAULT_SETTINGS,
  }

  return {
    find: () => findBirthdayGreeting(deps),
    update: (req) => updateBirthdayGreeting(deps, req),
    findLogs: () => findBirthdayGreetingLogs(deps),
  }
}

export default createBirthdayGreetingUsecase
