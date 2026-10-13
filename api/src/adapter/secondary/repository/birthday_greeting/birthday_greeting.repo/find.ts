import { isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { birthdayGreetingSettings } from '@/db/schema'
import * as Entity from '@/entities/birthday_greeting.entity'

import type { BirthdayGreetingRepoDeps } from '../birthday_greeting.repo'

export async function findBirthdayGreeting(
  deps: BirthdayGreetingRepoDeps,
): Promise<Entity.BirthdayGreetingSettings | null> {
  const [row] = await getExecutor()
    .select()
    .from(birthdayGreetingSettings)
    .where(isNull(birthdayGreetingSettings.deletedAt))
    .limit(1)
  return row ? deps.settingsToEntity(row) : null
}
