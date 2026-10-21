import { client } from './client'

export async function resetDatabase(): Promise<void> {
  console.log('\n[0/10] Reset database (truncating tables)...')
  await client.unsafe(`
    TRUNCATE TABLE
      whatsapp_login_requests,
      webhook_logs,
      customer_ratings,
      quotations,
      project_visits,
      projects,
      products,
      contacts,
      customers,
      unit_conversions,
      uoms,
      categories,
      broadcast_logs,
      broadcast_templates,
      birthday_greeting_logs,
      birthday_greeting_settings,
      users,
      role_permissions,
      roles,
      permissions,
      business_profiles
    RESTART IDENTITY CASCADE;
  `)

  try {
    await client.unsafe(`TRUNCATE TABLE cache.cache;`)
  } catch {
    // Cache schema/table might not exist; safe to ignore
  }

  console.log('  all tables truncated successfully.')
}
