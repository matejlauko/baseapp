import type { ItemInputApi } from '@/modules/input/components/item-input'
import type { Item } from '@/modules/items/items'
import { createContext } from 'react'

export interface ListContextType {
  selectItem: (itemId: string) => void
  itemInputRef: React.RefObject<ItemInputApi | null>
  filteredItems: Item[]
}

export const ListContext = createContext<ListContextType>(undefined as unknown as ListContextType)
