import { syncStore } from '@/lib/db/sync-store'
import { useDB } from '@/lib/db/use-db'
import { Button } from '@/lib/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/lib/ui/tooltip'
import { cn } from '@/lib/ui/utils'
import { cva } from 'cva'
import * as React from 'react'
import { useSnapshot } from 'valtio'

type SyncStatus = 'offline' | 'connecting' | 'syncing' | 'synced'

const syncIconStyles = cva({
  base: 'size-2.5 rounded-full',
  variants: {
    status: {
      error: 'bg-danger-700',
      offline: 'bg-neutral-700',
      connecting: 'bg-warning-700',
      syncing: 'bg-info-700',
      synced: 'bg-success-800',
    },
  },
})

const StatusText: Record<SyncStatus, string> = {
  offline: 'Offline',
  connecting: 'Connecting',
  syncing: 'Syncing',
  synced: 'Synced',
}

const SyncStatus: React.FC = () => {
  const db = useDB()
  const { isOnline, isSynced, isSyncing } = useSnapshot(syncStore)

  const getStatus = (): SyncStatus => {
    if (!isOnline) return 'offline'
    if (isSyncing) return 'syncing'

    return isSynced ? 'synced' : 'connecting'
  }

  const handleSyncClick = async () => {
    await db.push()
    db.pull()
  }

  const isSyncEnabled = isSynced && !isSyncing

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={isSyncEnabled ? handleSyncClick : undefined}
          aria-disabled={!isSyncEnabled}
        >
          <span className="text-sm">Sync</span>
          <div className={cn(syncIconStyles({ status: getStatus() }))} />
        </Button>
      </TooltipTrigger>

      <TooltipContent>{StatusText[getStatus()]}</TooltipContent>
    </Tooltip>
  )
}

export default SyncStatus
