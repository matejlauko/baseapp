import type { Session } from '@supabase/supabase-js'
import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { getLogger } from '../logger'
import { supabase } from '../supabase/client'
import { AuthContext } from './auth-context'

const { log } = getLogger('auth')

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      log('getSession', { session })

      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      log('onAuthStateChange', { event, session })

      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value: AuthContext = useMemo(() => {
    const isLoading = session === undefined
    const isAuthenticated = Boolean(session)

    return {
      session,
      isLoading,
      isAuthenticated,
    }
  }, [session])

  return <AuthContext value={value}>{children}</AuthContext>
}
