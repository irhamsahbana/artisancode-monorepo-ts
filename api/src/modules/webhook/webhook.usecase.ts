import { AppError, ErrorCode } from '@artisancode/types'

import { IPaymentGateway } from '@/contracts/integration/payment.contract'
import { IWebhookRepo, IWebhookUsecase } from '@/contracts/webhook.contract'

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
    processPaymentNotification: async (headers, body, targetPath) => {
      // 1. Verify webhook signature
      const isValid = deps.paymentGateway.verifyNotificationSignature(headers, body, targetPath)

      if (!isValid) {
        // Log invalid webhook attempt
        await deps.repo.logWebhook({
          headers,
          body,
          targetPath,
          isValid: false,
          errorMessage: 'Invalid signature',
        })

        throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid webhook signature')
      }

      // 2. Parse and process notification body
      let notificationData
      try {
        notificationData = JSON.parse(body)
      } catch {
        await deps.repo.logWebhook({
          headers,
          body,
          targetPath,
          isValid: false,
          errorMessage: 'Invalid JSON body',
        })

        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Invalid webhook body format')
      }

      // 3. Extract invoice number from notification data
      const invoiceNumber =
        notificationData.invoice_number || notificationData.order?.invoice_number

      if (!invoiceNumber) {
        await deps.repo.logWebhook({
          headers,
          body,
          targetPath,
          isValid: false,
          errorMessage: 'Missing invoice number',
        })

        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Missing invoice number in notification')
      }

      // 4. Check payment status with DOKU
      const statusResult = await deps.paymentGateway.checkStatus(invoiceNumber)

      // 5. Log successful webhook
      await deps.repo.logWebhook({
        headers,
        body,
        targetPath,
        isValid: true,
        invoiceNumber,
        paymentStatus: statusResult.transaction?.status,
      })

      return statusResult
    },

    getWebhookLogs: async (req) => {
      return await deps.repo.getWebhookLogs(req)
    },
  }
}
