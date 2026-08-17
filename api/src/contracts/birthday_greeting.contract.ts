import * as Entity from '@/entities/birthday_greeting.entity'

export interface IBirthdayGreetingRepo {
  find(): Promise<Entity.BirthdayGreetingSettings | null>
  update(
    req: Entity.UpdateBirthdayGreetingSettingsReq,
  ): Promise<Entity.BirthdayGreetingSettings | null>
  findLogs(): Promise<Entity.BirthdayGreetingLog[]>
  recordSend(
    recipientLogs: Entity.BirthdayGreetingRecipientLog[],
  ): Promise<Entity.BirthdayGreetingLog>
}

export interface IBirthdayGreetingUsecase {
  find(): Promise<Entity.BirthdayGreetingSettings>
  update(req: Entity.UpdateBirthdayGreetingSettingsReq): Promise<Entity.BirthdayGreetingSettings>
  findLogs(): Promise<Entity.BirthdayGreetingLog[]>
}
