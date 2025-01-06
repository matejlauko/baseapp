import { BottomBar } from '@/components/bottom-bar'
import { Commander } from '@/components/commander/commander'
import {
  addCommandsAtom,
  removeCommandsAtom,
  type Command,
} from '@/components/commander/commander-store'
import SyncStatus from '@/components/sync/sync-status'
import { useAuth } from '@/lib/auth/use-auth'
import { DBProvider } from '@/lib/db/db-provider'
import { Button } from '@/lib/ui/button'
import { createFileRoute, Link, Outlet, useNavigate, useRouter } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { UserIcon } from 'lucide-react'
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
  const addCommands = useSetAtom(addCommandsAtom)
  const removeCommands = useSetAtom(removeCommandsAtom)

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
      addCommands({ commands: loggedInCommands })
    } else {
      addCommands({ commands: loggedOutCommands })
    }

    return () => {
      removeCommands({ commands: [...loggedInCommands, ...loggedOutCommands], scope: 'list' })
    }
  }, [auth.isAuthenticated, router, navigate, handleLogout])

  return (
    <DBProvider>
      <HotkeysProvider initiallyActiveScopes={['list', 'commander']}>
        <Outlet />

        <BottomBar>
          {auth.isAuthenticated ? (
            <SyncStatus />
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/login">
                <UserIcon size={20} /> Login to sync
              </Link>
            </Button>
          )}
        </BottomBar>

        <Commander />
      </HotkeysProvider>
    </DBProvider>
  )
}
