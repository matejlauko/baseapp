import { BottomBar } from '@/components/bottom-bar'
import { Commander } from '@/components/commander/commander'
import { addCommands, removeCommands, type Command } from '@/components/commander/commander-store'
import SyncStatus from '@/components/sync/sync-status'
import { useAuth } from '@/lib/auth/use-auth'
import { DBProvider } from '@/lib/db/db-provider'
import { createFileRoute, Outlet, useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'
import { HotkeysProvider } from 'react-hotkeys-hook'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  validateSearch: (search): { auth?: boolean } => {
    return { auth: search.auth ? Boolean(search.auth) : undefined }
  },
})

function AppLayout() {
  const router = useRouter()
  const auth = useAuth()
  const navigate = useNavigate({ from: '/' })

  const handleLogout = useCallback(() => {
    auth.signOut().then(() => {
      router.invalidate().finally(() => {
        navigate({ to: '/' })
      })
    })
  }, [auth, router, navigate])

  useEffect(() => {
    const loggedInCommands: Command[] = [
      {
        name: 'Logout',
        action: handleLogout,
      },
    ]

    const loggedOutCommands: Command[] = [
      {
        name: 'Login',
        action: () => navigate({ to: '/login' }),
      },
    ]

    if (auth.isAuthenticated) {
      addCommands(loggedInCommands)
    } else {
      addCommands(loggedOutCommands)
    }

    return () => {
      removeCommands([...loggedInCommands, ...loggedOutCommands])
    }
  }, [auth.isAuthenticated, router, navigate, handleLogout])

  return (
    <DBProvider>
      <HotkeysProvider initiallyActiveScopes={['list', 'commander']}>
        <Outlet />

        <BottomBar>
          <SyncStatus />
        </BottomBar>

        <Commander />
      </HotkeysProvider>
    </DBProvider>
  )
}
