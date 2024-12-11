import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { supabase } from '../supabase/client'
import { AuthContext } from './auth-context'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return error
    }

    setSession(null)
  }, [])

  const value: AuthContext = useMemo(() => {
    let status: AuthContext['status'] = 'loading'
    if (session) {
      status = 'authenticated'
    } else if (session === null) {
      status = 'unauthenticated'
    }

    return {
      session,
      status,
      signOut,
    }
  }, [session, signOut])

  return <AuthContext value={value}>{children}</AuthContext>
}
