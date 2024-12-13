import type { Item } from '@/modules/items/items'
import { useMemo, type PropsWithChildren } from 'react'
import { useSnapshot } from 'valtio'
import { ListContext, type ListContextType } from './list-context'
import { listStore } from './list-store'
import { useFilterItems } from './use-filter-items'
import { useListNav } from './use-list-nav'

export const ListProvider = ({ items, children }: PropsWithChildren<{ items?: Item[] }>) => {
  const { selectedItemId } = useSnapshot(listStore)

  const setSelectedItemId = (itemId: string | null) => {
    listStore.selectedItemId = itemId
  }

  const filteredItems = useFilterItems(items ?? [])

  const selectItem = (itemId: string) => {
    setSelectedItemId(itemId)
  }

  const { prev, next } = useListNav({
    items: filteredItems,
    selectedItemId,
    setSelectedItemId,
  })

  const contextValue = useMemo(
    (): ListContextType => ({
      selectItem,
      filteredItems,
      selectPrev: prev,
      selectNext: next,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredItems]
  )

  return <ListContext value={contextValue}>{children}</ListContext>
}
