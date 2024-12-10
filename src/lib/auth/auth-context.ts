import type { AuthError, Session } from '@supabase/supabase-js'
import React from 'react'

export interface AuthContext {
  session: Session | null | undefined
  status: 'loading' | 'authenticated' | 'unauthenticated'
  signOut: () => Promise<void | AuthError>
}

export const AuthContext = React.createContext<AuthContext>({
  session: undefined,
  status: 'loading',
  signOut: () => Promise.resolve(),
})
