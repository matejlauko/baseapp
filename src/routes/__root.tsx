import { ThemeProvider } from '@/lib/ui/theme-provider'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <ThemeProvider storageKey="ui-theme">
        <div className="flex gap-2 p-2 text-lg">
          <Link
            to="/uisink"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Sink
          </Link>{' '}
          <Link
            to="/about"
            activeProps={{
              className: 'font-bold',
            }}
          >
            About
          </Link>
        </div>
        <hr />
        <Outlet />
      </ThemeProvider>

      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
