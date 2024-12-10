import { supabase } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Auth beforeLoad', { context, search })
    if (context.auth.session) {
      throw redirect({ to: search.redirect || '/' })
    }
  },
})

function AuthPage() {
  const search = Route.useSearch()

  return (
    <div className="container grid h-dvh place-items-center">
      <div className="w-full max-w-sm">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['github', 'twitter', 'google']}
          redirectTo={search.redirect || '/'}
        />
      </div>
    </div>
  )
}
