import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { withAuthMiddleware } from '../_shared/auth.ts'
import { handleError } from '../_shared/error.ts'
import { SyncPullReqData, syncPullReqDataSchema } from '../_shared/sync-types.ts'
import { PullSyncContext, pullSyncHandler } from './handler.ts'

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const FN = 'pull'

const app = new Hono().basePath(`/${FN}`)

handleError(app)

app.use(logger())
app.use(cors())

app.get(`/check`, (c) => {
  return c.json({ success: true })
})

app.post('/', withAuthMiddleware, async (c: PullSyncContext) => {
  const payload = await c.req.json<SyncPullReqData>()
  const data = syncPullReqDataSchema.parse(payload)

  console.log('Sync Pull Req data:', data)

  const resData = await pullSyncHandler(c, payload)

  console.log('Sync Pull Res data:', resData)

  return c.json(resData)
})

Deno.serve(app.fetch)
