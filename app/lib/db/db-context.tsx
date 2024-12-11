import { createContext } from 'react'
import type { DB } from './db'

export const DBContext = createContext<DB | null>(null)
