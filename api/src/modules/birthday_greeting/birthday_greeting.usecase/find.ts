import * as Entity from '@/entities/birthday_greeting.entity'

import type { BirthdayGreetingUsecaseDeps } from '../birthday_greeting.usecase'

export async function findBirthdayGreeting(
  deps: BirthdayGreetingUsecaseDeps,
): Promise<Entity.BirthdayGreetingSettings> {
  return (await deps.repo.find()) ?? deps.defaultSettings
}
