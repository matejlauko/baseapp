import type { ItemInputApi } from '@/modules/input/components/item-input'
import type { Item } from '@/modules/items/items'
import { useEffect, useMemo } from 'react'

export const useListNav = ({
  items,
  itemInputRef,
  selectedItemId,
  setSelectedItemId,
}: {
  items: Item[]
  itemInputRef: React.RefObject<ItemInputApi | null>
  selectedItemId: string | null
  setSelectedItemId: (itemId: string | null) => void
}) => {
  const itemIds = useMemo(() => items?.map((item) => item.id) ?? [], [items])

  // Handle keyboard navigation - up/down the list
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!itemIds) return

      const handleListKey = () => {
        event.preventDefault()
        event.stopPropagation()
        itemInputRef.current?.blur()
      }

      // Handle arrow down
      if (event.key === 'ArrowDown') {
        handleListKey()

        const currIndex = selectedItemId ? itemIds.indexOf(selectedItemId) : -1
        const nextItem = currIndex < itemIds.length - 1 ? itemIds[currIndex + 1] : itemIds[0]

        setSelectedItemId(nextItem)
      }

      // Handle arrow up
      if (event.key === 'ArrowUp') {
        handleListKey()

        const currIndex = selectedItemId ? itemIds.indexOf(selectedItemId) : -1

        // If at first item, focus the input
        if (currIndex === 0) {
          setSelectedItemId(null)
          itemInputRef.current?.focus()
          return
        }

        const prevItem = itemIds[currIndex - 1]

        setSelectedItemId(prevItem)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds, selectedItemId])

  useEffect(() => {
    if (selectedItemId && !itemIds.includes(selectedItemId)) {
      setSelectedItemId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds, setSelectedItemId])
}
