import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { authHeader, createGowaClientConfig } from '@/adapter/secondary/rest/gowa/client'

export function qrImageHandler() {
  return async (c: Context<AppEnv>) => {
    const path = c.req.query('path') ?? ''
    if (!/^\/statics\/qrcode\/[\w.-]+\.png$/.test(path)) {
      return c.body('Invalid QR path', 400)
    }

    const config = createGowaClientConfig()
    const response = await fetch(`${config.baseUrl}${path}`, {
      headers: { Authorization: authHeader(config) },
    })
    if (!response.ok) return c.body('QR image not found', 404)

    return new Response(response.body, {
      headers: { 'Content-Type': response.headers.get('Content-Type') ?? 'image/png' },
    })
  }
}
