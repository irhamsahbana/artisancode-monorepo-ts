import { getExecutor } from '@/common/executor'
import { birthdayGreetingLogs } from '@/db/schema'
import * as Entity from '@/entities/birthday_greeting.entity'

import type { BirthdayGreetingRepoDeps } from '../birthday_greeting.repo'

export async function recordBirthdayGreetingSend(
  deps: BirthdayGreetingRepoDeps,
  recipientLogs: Entity.BirthdayGreetingRecipientLog[],
): Promise<Entity.BirthdayGreetingLog> {
  const [row] = await getExecutor()
    .insert(birthdayGreetingLogs)
    .values({
      recipientCount: String(recipientLogs.length),
      recipientLogs,
    })
    .returning()
  return deps.logToEntity(row)
}
