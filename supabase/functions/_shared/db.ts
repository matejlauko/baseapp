import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../_database/schema.ts'

const connectionString = Deno.env.get('DB_URL')

if (!connectionString) {
  throw new Error('DB_URL is not set')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })
