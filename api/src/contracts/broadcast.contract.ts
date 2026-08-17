import * as Entity from '@/entities/broadcast.entity'

export interface IBroadcastRepo {
  createTemplate(req: Entity.CreateBroadcastTemplateReq): Promise<Entity.BroadcastTemplate>
  findTemplateList(page: number, perPage: number): Promise<Entity.BroadcastList>
  findLogs(): Promise<Entity.BroadcastLog[]>
  findLogsByTemplateId(templateId: string): Promise<Entity.BroadcastLog[]>
  countLogsForTemplate(templateId: string): Promise<number>
  deleteTemplate(id: string): Promise<void>

  // Actually creates the log and updates template status
  recordSend(
    templateId: string,
    recipientLogs: Entity.PerContactLog[],
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
