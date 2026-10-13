import { IPaymentGateway } from '@/contracts/integration/payment.contract'
import { IWebhookRepo, IWebhookUsecase } from '@/contracts/webhook.contract'

import { getWebhookLogs } from './webhook.usecase/get-webhook-logs'
import { processPaymentNotification } from './webhook.usecase/process-payment-notification'

export interface WebhookUsecaseDeps {
  repo: IWebhookRepo
  paymentGateway: IPaymentGateway
}

export function createWebhookUsecase(
  repo: IWebhookRepo,
  paymentGateway: IPaymentGateway,
): IWebhookUsecase {
  const deps: WebhookUsecaseDeps = { repo, paymentGateway }

  return {
    processPaymentNotification: (headers, body, targetPath) =>
      processPaymentNotification(deps, headers, body, targetPath),
    getWebhookLogs: (req) => getWebhookLogs(deps, req),
  }
}

export default createWebhookUsecase
