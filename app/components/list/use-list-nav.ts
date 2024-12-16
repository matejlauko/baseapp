import { getLogger } from '@/lib/logger'
import type { Item } from '@/modules/items/items'
import { useCallback, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const { log } = getLogger('list-nav')

export const useListNav = ({
  items,
  selectedItemId,
  setSelectedItemId,
}: {
  items: Item[]
  selectedItemId: string | null
  setSelectedItemId: (itemId: string | null) => void
}) => {
  const itemIds = useMemo(() => items?.map((item) => item.id) ?? [], [items])

  const prev = useCallback(() => {
    const currIndex = selectedItemId ? itemIds.indexOf(selectedItemId) : -1
    const prevItem = itemIds[currIndex - 1]

    log('prev', { currIndex, prevItem })

    // If at first item reset the selected item -- will focus the input
    if (currIndex === 0) {
      setSelectedItemId(null)
      return
    }

    setSelectedItemId(prevItem)
  }, [itemIds, selectedItemId, setSelectedItemId])

  const next = useCallback(() => {
    const currIndex = selectedItemId ? itemIds.indexOf(selectedItemId) : -1
    const nextItem = currIndex < itemIds.length - 1 ? itemIds[currIndex + 1] : itemIds[0]

    log('next', { itemIds, currIndex, nextItem })

    setSelectedItemId(nextItem)
  }, [itemIds, selectedItemId, setSelectedItemId])

  useHotkeys('ArrowDown', next, { scopes: ['list'] }, [next])

  useHotkeys('ArrowUp', prev, { scopes: ['list'] }, [prev])

  /* Clear selected item if it's not in the list anymore */
  useEffect(() => {
    if (selectedItemId && !itemIds.includes(selectedItemId)) {
      setSelectedItemId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds, setSelectedItemId])

  return { prev, next }
}
