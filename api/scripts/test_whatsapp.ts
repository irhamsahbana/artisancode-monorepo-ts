import { env } from '../src/config/env'
import { getWhatsAppProvider } from '../src/integrations/whatsapp'

const main = async () => {
  const to = process.argv[2]
  const message = process.argv[3] || 'Test message from crm-wika WhatsApp integration'

  if (!to) {
    console.error('Usage: bun scripts/test_whatsapp.ts <phone> [message]')
    process.exit(1)
  }

  console.log('--- Testing WhatsApp provider ---')
  console.log('Provider:', env.WHATSAPP.PROVIDER)
  console.log('To:', to)
  console.log('Message:', message)

  const provider = getWhatsAppProvider()

  try {
    const res = await provider.sendTextMessage({ to, message })
    console.log('--- Success ---')
    console.log('Message ID:', res.messageId)
  } catch (error) {
    console.error('--- Error ---')
    console.error(error)
    process.exit(1)
  }
}

main()
