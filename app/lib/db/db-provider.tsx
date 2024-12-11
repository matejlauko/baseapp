import { useEffect, useState, type PropsWithChildren } from 'react'
import { useAuth } from '../auth/use-auth'
import { getDBClient, initDB, type DB } from './db'
import { DBContext } from './db-context'

export const DBProvider = ({ children }: PropsWithChildren) => {
  const [db, setDB] = useState<DB | null>(getDBClient())
  const auth = useAuth()

  useEffect(() => {
    if (!db && auth.session) {
      setDB(initDB(auth.session))
    }
  }, [auth, auth.session, db])

  if (!db) {
    return null
  }

  return <DBContext.Provider value={db}>{children}</DBContext.Provider>
}
