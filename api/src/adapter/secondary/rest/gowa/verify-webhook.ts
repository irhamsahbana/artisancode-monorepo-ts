import crypto from 'crypto'

/**
 * Verifies the `X-Hub-Signature-256: sha256={hmac}` header gowa sends on
 * incoming webhook calls. See docs/webhook-payload.md in the gowa repo.
 */
export function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  signatureHeader: string | undefined | null,
): boolean {
  if (!signatureHeader?.startsWith('sha256=')) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')
  const received = signatureHeader.slice('sha256='.length)

  const expectedBuf = Buffer.from(expected, 'hex')
  const receivedBuf = Buffer.from(received, 'hex')
  if (expectedBuf.length !== receivedBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}
