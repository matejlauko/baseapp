import type { AuthContext } from '@/lib/auth/auth-context'
import { useAuth } from '@/lib/auth/use-auth'
import { Button } from '@/lib/ui/button'
import { ThemeProvider } from '@/lib/ui/theme/theme-provider'
import { Outlet, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface RouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const auth = useAuth()

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.invalidate().finally(() => {
        navigate({ to: '/auth' })
      })
    })
  }

  return (
    <>
      <ThemeProvider storageKey="ui-theme">
        <Outlet />
        <div className="fixed bottom-4 left-4">
          {auth.session ? (
            <div>
              {auth.session.user.email} :{' '}
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="ghost">Login</Button>
          )}
        </div>
      </ThemeProvider>

      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
