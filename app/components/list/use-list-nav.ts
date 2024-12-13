import type { Item } from '@/modules/items/items'
import { useCallback, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

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
    console.log('prev')
    const currIndex = selectedItemId ? itemIds.indexOf(selectedItemId) : -1

    // If at first item, focus the input
    if (currIndex === 0) {
      setSelectedItemId(null)
      return
    }

    const prevItem = itemIds[currIndex - 1]

    setSelectedItemId(prevItem)
  }, [itemIds, selectedItemId, setSelectedItemId])

  const next = useCallback(() => {
    const currIndex = selectedItemId ? itemIds.indexOf(selectedItemId) : -1
    const nextItem = currIndex < itemIds.length - 1 ? itemIds[currIndex + 1] : itemIds[0]

    console.log('next', { itemIds, currIndex, nextItem })

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

// Handle keyboard navigation - up/down the list
// useEffect(() => {
//   const handleKeyDown = (event: KeyboardEvent) => {
//     console.log('list keydown')

//     // if (!itemIds) return

//     // const handleListKey = () => {
//     //   event.preventDefault()
//     //   event.stopPropagation()
//     // }

//     // // Handle arrow down
//     // if (event.key === 'ArrowDown') {
//     //   handleListKey()

//     // }

//     // // Handle arrow up
//     // if (event.key === 'ArrowUp') {
//     //   handleListKey()

//     // }
//   }

//   window.addEventListener('keydown', handleKeyDown)
//   return () => window.removeEventListener('keydown', handleKeyDown)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [itemIds, selectedItemId])
