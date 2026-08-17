import { AppError, ErrorCode } from '@artisancode/types'

import {
  IBirthdayGreetingRepo,
  IBirthdayGreetingUsecase,
} from '@/contracts/birthday_greeting.contract'
import * as Entity from '@/entities/birthday_greeting.entity'

const DEFAULT_MESSAGE =
  'Selamat Ulang Tahun {{nama}}! 🎉\n\nSemoga selalu diberikan kesehatan, kebahagiaan, dan kesuksesan. Terima kasih atas kepercayaan Anda bersama kami.'

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

export function createBirthdayGreetingUsecase(
  repo: IBirthdayGreetingRepo,
): IBirthdayGreetingUsecase {
  return {
    find: async () => (await repo.find()) ?? DEFAULT_SETTINGS,

    update: async (req) => {
      const item = await repo.update(req)
      if (!item)
        throw new AppError(ErrorCode.NOT_FOUND, 'Failed to save birthday greeting settings')
      return item
    },

    findLogs: () => repo.findLogs(),
  }
}
