import { use } from 'react'
import type { ReadTransaction } from 'replicache'
import { useSubscribe, type RemoveUndefined } from 'replicache-react'
import type { DB } from './db'
import { DBContext } from './db-context'

export const useDB = () => {
  const db = use(DBContext)

  if (!db) {
    throw new Error('useDB must be used within a DBContext')
  }

  return db
}

export const useSub = <Tx extends ReadTransaction, QueryRet, Default = undefined>(
  fn?: (tx: Tx) => Promise<QueryRet>,
  deps?: Parameters<typeof useSubscribe>[2]
): RemoveUndefined<QueryRet> | Default => {
  const db = useDB()

  // @ts-expect-error What can you do.
  return useSubscribe(db, fn, deps)
}

export const useMutation = <D, R>(fn: (db: DB) => (data: D) => Promise<R | false>) => {
  const db = useDB()

  return fn(db)
}
