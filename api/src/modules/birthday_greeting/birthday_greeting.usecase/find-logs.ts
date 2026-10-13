import * as Entity from '@/entities/birthday_greeting.entity'

import type { BirthdayGreetingUsecaseDeps } from '../birthday_greeting.usecase'

export async function findBirthdayGreetingLogs(
  deps: BirthdayGreetingUsecaseDeps,
): Promise<Entity.BirthdayGreetingLog[]> {
  return deps.repo.findLogs()
}
