import { AppError, ErrorCode } from '@artisancode/types'

import type { CheckStatusRes } from '@/contracts/integration/payment.contract'

import type { WebhookUsecaseDeps } from '../webhook.usecase'

export async function processPaymentNotification(
  deps: WebhookUsecaseDeps,
  headers: Record<string, string | string[] | undefined>,
  body: string,
  targetPath: string,
): Promise<CheckStatusRes> {
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
}
