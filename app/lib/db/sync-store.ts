import { proxy } from 'valtio'

export const syncStore = proxy({
  isOnline: true,
  isSyncing: false,
  isSynced: false,
})
