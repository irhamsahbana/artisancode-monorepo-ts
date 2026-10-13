import { desc } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { birthdayGreetingLogs } from '@/db/schema'
import * as Entity from '@/entities/birthday_greeting.entity'

import type { BirthdayGreetingRepoDeps } from '../birthday_greeting.repo'

export async function findBirthdayGreetingLogs(
  deps: BirthdayGreetingRepoDeps,
): Promise<Entity.BirthdayGreetingLog[]> {
  const rows = await getExecutor()
    .select()
    .from(birthdayGreetingLogs)
    .orderBy(desc(birthdayGreetingLogs.sentAt))
  return rows.map(deps.logToEntity)
}
