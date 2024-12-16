import { AuthForm, type AuthFormData } from '@/components/auth/auth-form'
import { useAuth } from '@/lib/auth/use-auth'
import { Card, CardDescription, CardTitle } from '@/lib/ui/card'
import { useToast } from '@/lib/ui/use-toast'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { CheckCircle2Icon } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  component: AuthPage,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.session) {
      throw redirect({ to: search.redirect || '/' })
    }
  },
})

function AuthPage() {
  const auth = useAuth()
  const { toast } = useToast()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleLogin = async (data: AuthFormData) => {
    if (await auth.signInWithOtp(data.email)) {
      toast({
        title: 'Error logging in',
        description: 'Please try again',
        variant: 'destructive',
      })
    } else {
      setShowSuccess(true)
    }
  }

  return (
    <div className="container grid min-h-dvh place-items-center">
      <Card className="w-full max-w-md p-6">
        <CardTitle className="mb-1 text-center text-2xl">Login or sign up</CardTitle>
        <CardDescription className="text-center">
          Receive an email with a magic link to login or sign up
        </CardDescription>

        <div className="mx-auto mt-6 max-w-sm">
          <AuthForm onSubmit={handleLogin} />
        </div>

        {showSuccess && (
          <div className="mt-6 flex max-w-sm items-center justify-center space-x-2 text-sm">
            <CheckCircle2Icon className="text-green-500" />
            <span>Check your email for a magic link</span>
          </div>
        )}
      </Card>
    </div>
  )
}
