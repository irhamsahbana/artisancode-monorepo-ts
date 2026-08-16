import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '../schema'

// Standalone connection — does not go through the app's singleton
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL env var is not set')

export const client = postgres(DATABASE_URL, { max: 1 })
export const db = drizzle(client, { schema })
