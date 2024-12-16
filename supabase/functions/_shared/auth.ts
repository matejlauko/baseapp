import { Context } from 'hono'
// import { bearerAuth } from "jsr:@hono/hono/bearer-auth";
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import { createMiddleware } from 'hono/factory'

export type AuthContextVariables = {
  supaClient: SupabaseClient
  user: User
  userId: User['id']
}
export type AuthContext = Context<{ Variables: AuthContextVariables }>

export const supaMiddleware = createMiddleware(async (c: AuthContext, next) => {
  const authHeader = c.req.header('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  c.set('supaClient', supabaseClient)
  // c.set("user", null);
  // c.set("userId", null);

  await next()
})

export const withAuthMiddleware = createMiddleware(async (c: AuthContext, next) => {
  const authHeader = c.req.header('Authorization')!

  if (!authHeader) {
    return c.text('Unauthorized', 401)
  }

  if (!c.get('supaClient')) {
    await supaMiddleware(c, () => Promise.resolve())
  }

  const supaClient = c.get('supaClient')

  const {
    data: { user },
  } = await supaClient.auth.getUser()

  if (!user) {
    return c.text('Unauthorized', 401)
  }

  c.set('user', user)
  c.set('userId', user.id)

  await next()
})
