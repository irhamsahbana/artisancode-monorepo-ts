// Webhook processing types — provider-agnostic
import type { PaginationMetadata, PaginationQuery } from '@/entities/pagination.entity'

import type { CheckStatusRes } from './integration/payment.contract'

export interface WebhookLog {
  id: string
  headers: Record<string, string | string[] | undefined>
  body: string
  targetPath: string
  isValid: boolean
  errorMessage?: string
  invoiceNumber?: string
  paymentStatus?: string
  createdAt: Date
}

export interface LogWebhookParams {
  headers: Record<string, string | string[] | undefined>
  body: string
  targetPath: string
  isValid: boolean
  errorMessage?: string
  invoiceNumber?: string
  paymentStatus?: string
}

export interface GetWebhookLogListReq {
  invoiceNumber?: string
  pagination?: PaginationQuery
}

export interface WebhookLogList {
  items: WebhookLog[]
  pagination: PaginationMetadata
}

export interface IWebhookRepo {
  logWebhook(params: LogWebhookParams): Promise<WebhookLog>
  getWebhookLogs(req: GetWebhookLogListReq): Promise<WebhookLogList>
}

export interface IWebhookUsecase {
  processPaymentNotification(
    headers: Record<string, string | string[] | undefined>,
    body: string,
    targetPath: string,
  ): Promise<CheckStatusRes>
  getWebhookLogs(req: GetWebhookLogListReq): Promise<WebhookLogList>
}
