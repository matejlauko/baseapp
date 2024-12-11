import { syncStore } from '@/lib/db/sync-store'
import { useDB } from '@/lib/db/use-db'
import { Button } from '@/lib/ui/button'
import { cn } from '@/lib/ui/utils'
import { cva } from 'cva'
import * as React from 'react'
import { useSnapshot } from 'valtio'

const syncIconStyles = cva({
  base: 'size-2.5 rounded-full',
  variants: {
    status: {
      error: 'bg-danger-700',
      offline: 'bg-gray-700',
      connecting: 'bg-yellow-700',
      online: 'bg-success-700',
      syncing: 'bg-blue-700',
    },
  },
})

const SyncStatus: React.FC = () => {
  const db = useDB()
  const { isOnline, isSynced, isSyncing } = useSnapshot(syncStore)

  const getStatus = () => {
    if (!isOnline) return 'offline'
    if (isSyncing) return 'syncing'

    return 'online'
  }

  const handleSyncClick = async () => {
    await db.push()
    db.pull()
  }

  return (
    <div>
      <Button variant="secondary" onClick={handleSyncClick}>
        <span className="text-sm">Sync</span>
        <div className={cn(syncIconStyles({ status: getStatus() }))} />
      </Button>
    </div>
  )
}

export default SyncStatus
