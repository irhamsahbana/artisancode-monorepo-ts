import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/birthday_greeting.entity'

import type { BirthdayGreetingUsecaseDeps } from '../birthday_greeting.usecase'

export async function updateBirthdayGreeting(
  deps: BirthdayGreetingUsecaseDeps,
  req: Entity.UpdateBirthdayGreetingSettingsReq,
): Promise<Entity.BirthdayGreetingSettings> {
  const item = await deps.repo.update(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Failed to save birthday greeting settings')
  return item
}
