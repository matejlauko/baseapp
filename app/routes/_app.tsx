import SyncStatus from '@/components/sync/sync-status'
import { DBProvider } from '@/lib/db/db-provider'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <DBProvider>
      <Outlet />

      <SyncStatus />
    </DBProvider>
  )
}
