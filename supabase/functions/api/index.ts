import { and, eq } from 'drizzle-orm'
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { z } from 'zod'
import {
  createItemSchema,
  InsertItem,
  Items,
  selectItemSchema,
  updateItemSchema,
} from '../_database/schema.ts'
import { AuthContextVariables, supaMiddleware, withAuthMiddleware } from '../_shared/auth.ts'
import { db } from '../_shared/db.ts'
import { handleError } from '../_shared/error.ts'
import { failRes, jsonRes } from '../_shared/res.ts'

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const FN = 'api'

// const app = new Hono()
const app = new Hono().basePath(`/${FN}`)

handleError(app)

app.use(logger())
app.use(cors())
app.use(supaMiddleware)

type CustomContext = Context<{ Variables: AuthContextVariables }>

app.get(`/check`, withAuthMiddleware, (c) => {
  return c.json({ success: true })
})

/* AUTH */

const authPassSchema = z.object({
  email: z.string().email(),
  pass: z.string().min(8),
})
type AuthPassData = z.infer<typeof authPassSchema>

app.post('/auth/signup', async (c: CustomContext) => {
  const payload = await c.req.json<AuthPassData>()

  const { email, pass } = authPassSchema.parse(payload)

  const { data, error } = await c.get('supaClient').auth.signUp({
    email,
    password: pass,
  })

  // return c.json({ success: false }, 401, {
  //   statusText: 'Unauthorized',
  // })

  if (error) {
    throw error
  }

  return jsonRes(c, data)
})

app.post('/auth/signin', async (c: CustomContext) => {
  const payload = await c.req.json<AuthPassData>()

  const { email, pass } = authPassSchema.parse(payload)

  const { data, error } = await c.get('supaClient').auth.signInWithPassword({
    email,
    password: pass,
  })

  // return c.text('Unauthorized', 401)

  if (error) {
    throw error
  }

  return jsonRes(c, data)
})

/* ITEMS */

app.get(`/items`, withAuthMiddleware, async (c: CustomContext) => {
  const user = c.get('user')!

  const items = await db
    .select()
    .from(Items)
    .where(and(eq(Items.userId, user.id), eq(Items.deleted, false)))

  return jsonRes(c, items, { schema: selectItemSchema.array() })
})

app.get(`/items/:id`, withAuthMiddleware, async (c: CustomContext) => {
  const user = c.get('user')!

  const { id } = c.req.param()

  z.string().uuid().parse(id)

  const item = await db.query.Items.findFirst({
    where: and(eq(Items.id, id), eq(Items.userId, user.id)),
  })

  if (!item) {
    return failRes(c, 'Item not found', 404)
  }

  return jsonRes(c, item, { schema: selectItemSchema })
})

app.post(`/items`, withAuthMiddleware, async (c: CustomContext) => {
  const user = c.get('user')!

  const payload = await c.req.json()
  const data = createItemSchema.parse(payload) as InsertItem

  const [newItem] = await db
    .insert(Items)
    .values({
      ...data,
      userId: user.id,
    })
    .returning()

  return jsonRes(c, newItem, { schema: selectItemSchema })
})

app.put(`/items/:id`, withAuthMiddleware, async (c: CustomContext) => {
  const user = c.get('user')!

  const id = z.string().uuid().parse(c.req.param().id)

  const payload = await c.req.json()
  const data = updateItemSchema.parse(payload) as InsertItem

  const [updatedItem] = await db
    .update(Items)
    .set(data)
    .where(and(eq(Items.id, id), eq(Items.userId, user.id)))
    .returning()

  if (!updatedItem) {
    return failRes(c, 'Item not found', 404)
  }

  return jsonRes(c, updatedItem, { schema: selectItemSchema })
})

app.delete(`/items/:id`, withAuthMiddleware, async (c: CustomContext) => {
  const user = c.get('user')!

  const id = z.string().uuid().parse(c.req.param().id)

  const [deletedItem] = await db
    .update(Items)
    .set({ deleted: true })
    .where(and(eq(Items.id, id), eq(Items.userId, user.id)))
    .returning({ id: Items.id })

  if (!deletedItem) {
    return failRes(c, 'Item not found', 404)
  }

  return jsonRes(c, deletedItem)
})

Deno.serve(app.fetch)

/* To invoke locally:

  # Create an item
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/api/items' \
    --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{"title":"Item1","text":"Text1","type":"idea","tags":["tag1"],"userId":"USER_ID"}'

  # Get an item
  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/api/items/ITEM_ID' \
    --header 'Authorization: Bearer YOUR_BEARER_TOKEN'

  # Update an item
  curl -i --location --request PUT 'http://127.0.0.1:54321/functions/v1/api/items/ITEM_ID' \
    --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{"title":"UpdatedItem","text":"UpdatedText","type":"task","tags":["tag1","tag2"],"userId":"USER_ID"}'

  # Delete an item
  curl -i --location --request DELETE 'http://127.0.0.1:54321/functions/v1/api/items/ITEM_ID' \
    --header 'Authorization: Bearer YOUR_BEARER_TOKEN'

*/
