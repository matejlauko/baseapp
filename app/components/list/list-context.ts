import type { Item } from '@/modules/items/items'
import { createContext } from 'react'

export interface ListContextType {
  selectItem: (itemId: string) => void
  filteredItems: Item[]
  selectPrev: () => void
  selectNext: () => void
}

export const ListContext = createContext<ListContextType>(undefined as unknown as ListContextType)
