import type { Session } from '@supabase/supabase-js'
import React from 'react'

export interface AuthContext {
  session: Session | null | undefined
  isLoading: boolean
  isAuthenticated: boolean
}

export const AuthContext = React.createContext<AuthContext>({
  session: undefined,
  isLoading: true,
  isAuthenticated: false,
})
