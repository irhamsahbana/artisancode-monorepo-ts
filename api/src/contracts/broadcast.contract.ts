import * as Entity from '@/entities/broadcast.entity'

export interface IBroadcastRepo {
  createTemplate(req: Entity.CreateBroadcastTemplateReq): Promise<Entity.BroadcastTemplate>
  findTemplateList(page: number, perPage: number): Promise<Entity.BroadcastList>
  findLogs(): Promise<Entity.BroadcastLog[]>
  findLogsByTemplateId(templateId: string): Promise<Entity.BroadcastLog[]>
  countLogsForTemplate(templateId: string): Promise<number>
  deleteTemplate(id: string): Promise<void>

  // Actually creates the log and (by default) updates template status.
  // markSent: false skips the status flip — used for recurring per-occurrence
  // sends (e.g. birthday greetings) that fire again on a future date.
  recordSend(
    templateId: string,
    recipientLogs: Entity.PerContactLog[],
    options?: { markSent?: boolean },
  ): Promise<Entity.BroadcastLog>
}

export interface IBroadcastUsecase {
  createTemplate(req: Entity.CreateBroadcastTemplateReq): Promise<Entity.BroadcastTemplate>
  findTemplateList(page: number, perPage: number): Promise<Entity.BroadcastList>
  findLogs(): Promise<Entity.BroadcastLog[]>
  findLogsByTemplateId(templateId: string): Promise<Entity.BroadcastLog[]>
  deleteTemplate(id: string): Promise<void>

  send(req: Entity.SendBroadcastReq): Promise<Entity.SendBroadcastRes>
}
