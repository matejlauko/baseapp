import type { AuthContext } from '@/lib/auth/auth-context'
import { ThemeProvider } from '@/lib/ui/theme/theme-provider'
import { Toaster } from '@/lib/ui/toaster'
import { TooltipProvider } from '@/lib/ui/tooltip'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface RouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <ThemeProvider storageKey="ui-theme">
        <TooltipProvider>
          <Outlet />

          <Toaster />
        </TooltipProvider>
      </ThemeProvider>

      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  )
}
