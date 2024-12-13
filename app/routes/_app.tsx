import { BottomBar } from '@/components/bottom-bar'
import { Commander } from '@/components/commander/commander'
import SyncStatus from '@/components/sync/sync-status'
import { useAuth } from '@/lib/auth/use-auth'
import { DBProvider } from '@/lib/db/db-provider'
import { Button } from '@/lib/ui/button'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { HotkeysProvider } from 'react-hotkeys-hook'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const router = useRouter()
  const auth = useAuth()

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.invalidate().finally(() => {
        router.navigate({ to: '/auth' })
      })
    })
  }

  return (
    <DBProvider>
      <HotkeysProvider initiallyActiveScopes={['list', 'commander']}>
        <Outlet />

        <BottomBar>
          <SyncStatus />
          <div>
            {auth.session?.user.email} :{' '}
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </BottomBar>

        <Commander />
      </HotkeysProvider>
    </DBProvider>
  )
}
