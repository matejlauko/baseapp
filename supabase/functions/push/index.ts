import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { withAuthMiddleware } from '../_shared/auth.ts'
import { handleError } from '../_shared/error.ts'
import { jsonRes } from '../_shared/res.ts'
import { SyncPushReqData, syncPushReqDataSchema } from '../_shared/sync-types.ts'
import { PushSyncContext, pushSyncHandler } from './handler.ts'

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const FN = 'push'

const app = new Hono().basePath(`/${FN}`)

handleError(app)

app.use(logger())
app.use(cors())

app.get(`/check`, (c) => {
  return c.json({ success: true })
})

app.post('/', withAuthMiddleware, async (c: PushSyncContext) => {
  const payload = await c.req.json<SyncPushReqData>()
  const data = syncPushReqDataSchema.parse(payload)

  console.log('Sync Push Req data:', data)

  const resData = await pushSyncHandler(c, data)

  console.log('Sync Push Res data:', resData)

  return jsonRes(c, { success: true })
})

Deno.serve(app.fetch)
