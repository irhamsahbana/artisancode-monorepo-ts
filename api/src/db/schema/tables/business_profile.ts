import { pgTable, text } from 'drizzle-orm/pg-core'

import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// BusinessProfile (single-row: the company running this CRM)
// ---------------------------------------------------------------------------
export const businessProfiles = pgTable('business_profiles', {
  id: defaultId,
  name: text('name').notNull(),
  businessType: text('business_type'),
  phone: text('phone'),
  countryCode: text('country_code').notNull().default('62'),
  email: text('email'),
  address: text('address'),
  // Which gowa device (X-Device-Id) sends outbound system messages (login
  // confirmation, broadcasts, birthday greetings) when multiple devices are
  // connected. Null until an admin picks one in Settings > Koneksi WhatsApp.
  whatsappDeviceId: text('whatsapp_device_id'),
  // Filename of the uploaded browser-tab icon (e.g. "icon.png"), stored on
  // the shared `branding` volume read by both api and web. Null = use the
  // bundled default icon instead.
  iconFilename: text('icon_filename'),
  ...timestamps,
  ...softDelete,
})
