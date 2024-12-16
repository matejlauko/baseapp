import { dumpAllItems } from '@/modules/items/queries'
import type { AuthSession } from '@supabase/supabase-js'
import { Replicache } from 'replicache'
import { API_URL } from '../api/request'
import { getLogger } from '../logger'
import { mutators } from './mutators'
import { syncStore } from './sync-store'

const { log } = getLogger('db')

const DB_TEMPUSERID_STORAGE_KEY = 'tempUserId'
const LICENSE_KEY = import.meta.env.VITE_REPLICACHE_LICENSE_KEY

let _db: DB | null = null

const getRepName = (userId?: string) => {
  if (userId) {
    return `baseapp-db-user_${userId}`
  }

  let tempUserId = window.localStorage.getItem(DB_TEMPUSERID_STORAGE_KEY)

  if (!tempUserId) {
    tempUserId = crypto.randomUUID().slice(0, 8)
    window.localStorage.setItem(DB_TEMPUSERID_STORAGE_KEY, tempUserId)
  }

  return `baseapp-db-anon_${tempUserId}`
}

export function createDB(authSession?: AuthSession | null) {
  const repName = getRepName(authSession?.user.id)

  log('createDB', {
    authSession,
    repName,
  })

  return new Replicache({
    name: repName,
    licenseKey: LICENSE_KEY,
    mutators,
    pushURL: authSession ? `${API_URL}/push` : undefined,
    pullURL: authSession ? `${API_URL}/pull` : undefined,
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
    if (syncing) {
      syncStore.isSynced = false
    } else if (syncStore.isSyncing === true) {
      syncStore.isSynced = true
    }

    syncStore.isSyncing = syncing
  }

  if (authSession) {
    restoreItems(db)
  }

  _db = db

  return db
}

export function getDBClient() {
  return _db!
}

/**
 * Restore items from the old temporary database when user is signed in
 */
async function restoreItems(db: DB) {
  const oldTempDB = createDB()

  if (oldTempDB) {
    const items = await oldTempDB.query(dumpAllItems)

    await Promise.allSettled(items.map((item) => db.mutate.setItem(item)))

    await Promise.allSettled(items.map((item) => oldTempDB.mutate.deleteItem(item.id)))

    setTimeout(() => {
      oldTempDB.close()
    }, 500)
  }
}
