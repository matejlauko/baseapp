import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

dotenv.config({ path: '.env.local' })

const dbUrl = process.env.DB_URL

if (!dbUrl) {
  throw new Error('DB_URL is not set')
}

export default defineConfig({
  schema: './supabase/functions/_database/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  verbose: true,
  schemaFilter: ['app_base'],
  migrations: {
    schema: 'app_base',
  },
  dbCredentials: {
    url: dbUrl,
  },
})
