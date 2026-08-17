import type { IPaymentGateway } from '@/contracts/integration/payment.contract'

import { WebhookRepo } from './webhook.repo'
import { createWebhookUsecase } from './webhook.usecase'

export function createWebhookModule(paymentGateway: IPaymentGateway) {
  const repo = new WebhookRepo()
  const usecase = createWebhookUsecase(repo, paymentGateway)

  return {
    repo,
    usecase,
  }
}
