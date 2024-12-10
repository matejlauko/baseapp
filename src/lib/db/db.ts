import type { AuthSession } from '@supabase/supabase-js'
import { Replicache } from 'replicache'
import { API_URL } from '../api/request'
import { mutators } from './mutators'
import { syncStore } from './sync-store'

const LICENSE_KEY = import.meta.env.VITE_REPLICACHE_LICENSE_KEY

let _db: DB | null = null

const getRepName = (userId?: string) => {
  return userId ? `baseapp-db-u_${userId}` : 'baseapp-db-anon'
}

export function createDB(authSession?: AuthSession | null) {
  return new Replicache({
    name: getRepName(authSession?.user.id),
    licenseKey: LICENSE_KEY,
    mutators,
    pushURL: `${API_URL}/sync/push`,
    pullURL: `${API_URL}/sync/pull`,
    // logLevel: 'debug',
    schemaVersion: '1.0.0',
    auth: authSession?.access_token ? `Bearer ${authSession?.access_token}` : undefined,
    pullInterval: null,
  })
}

export type DB = ReturnType<typeof createDB>

export function initDB(authSession?: AuthSession | null) {
  const db = createDB(authSession)

  // @ts-expect-error For testing
  window.db = db

  db.onOnlineChange = (online) => {
    syncStore.isOnline = online
  }

  db.onSync = (syncing) => {
    if (syncing === false && syncStore.isSyncing === true) {
      syncStore.isSynced = true
    }

    syncStore.isSyncing = syncing
  }

  _db = db

  return db
}

export function getDBClient() {
  return _db!
}
