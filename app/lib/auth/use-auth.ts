import type { AuthError } from '@supabase/supabase-js'
import { use, useCallback } from 'react'
import { getLogger } from '../logger'
import { supabase } from '../supabase/client'
import { AuthContext } from './auth-context'

const { log, captureError } = getLogger('auth')

export const useAuth = (): AuthContext & {
  signOut: () => Promise<void | AuthError>
  signInWithOtp: (email: string) => Promise<void | AuthError>
} => {
  const context = use(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  const signOut = useCallback(async () => {
    log('signOut')

    try {
      const { error } = await supabase.auth.signOut()
      window.location.reload()

      if (error) {
        throw error
      }
    } catch (error) {
      captureError(error)

      return error as AuthError
    }
  }, [])

  const signInWithOtp = useCallback(async (email: string) => {
    log('signInWithOtp', { email })

    try {
      const response = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      log('signInWithOtp', { response })

      if (response.error) {
        throw response.error
      }
    } catch (error) {
      captureError(error)

      return error as AuthError
    }
  }, [])

  return {
    ...context,
    signOut,
    signInWithOtp,
  }
}
