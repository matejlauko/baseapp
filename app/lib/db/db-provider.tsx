import { useRef, type PropsWithChildren } from 'react'
import { useAuth } from '../auth/use-auth'
import { initDB, type DB } from './db'
import { DBContext } from './db-context'

export const DBProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuth()
  const dbRef = useRef<DB | null>(null)

  if (!dbRef.current && !auth.isLoading) {
    dbRef.current = initDB(auth.session)

    const db = dbRef.current

    db.getAuth = async () => {
      await auth.signOut()
      window.location.reload()

      return null
    }
  }

  if (!dbRef.current) {
    return null
  }

  return <DBContext.Provider value={dbRef.current}>{children}</DBContext.Provider>
}
