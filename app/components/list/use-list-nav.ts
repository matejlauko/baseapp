import { getLogger } from '@/lib/logger'
import { useCallback, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSnapshot } from 'valtio'
import { treeStore } from '../tree/store'
import { useTree } from '../tree/use-tree'

const { log } = getLogger('list-nav')

export const useListNav = <T>() => {
  const { selectedItemId } = useSnapshot(treeStore)
  const { nodesMap, flatNodes, nodeIds, selectId } = useTree<T>()

  const prev = useCallback(() => {
    const selectedItem = selectedItemId ? nodesMap.get(selectedItemId) : null

    if (!selectedItem) return

    // If at first item reset the selected item -- will focus the input
    if (selectedItem.index === 0) {
      selectId(null)
      return
    }

    const prevItem = flatNodes[selectedItem.index - 1]

    log('prev', { selectedItem, prevItem })

    selectId(prevItem.id)
  }, [selectedItemId, selectId, flatNodes, nodesMap])

  const next = useCallback(() => {
    const selectedItem = selectedItemId ? nodesMap.get(selectedItemId) : null

    const currIndex = selectedItem?.index ?? -1
    const nextItem = currIndex < flatNodes.length - 1 ? flatNodes[currIndex + 1] : flatNodes[0]

    log('next', { currIndex, nextItem, selectedItem })

    selectId(nextItem.id)
  }, [selectedItemId, selectId, flatNodes, nodesMap])

  const up = useCallback(() => {
    const selectedItem = selectedItemId ? nodesMap.get(selectedItemId) : null

    if (!selectedItem) return

    if (selectedItem.parentId) {
      selectId(selectedItem.parentId)
    }
  }, [selectedItemId, selectId, nodesMap])

  const down = useCallback(() => {
    const selectedItem = selectedItemId ? nodesMap.get(selectedItemId) : null

    if (!selectedItem) return

    if (selectedItem.children.length > 0) {
      selectId(selectedItem.children[0].id)
    }
  }, [selectedItemId, selectId, nodesMap])

  useHotkeys('ArrowDown', next, { scopes: ['list'] }, [next])
  useHotkeys('ArrowUp', prev, { scopes: ['list'] }, [prev])
  useHotkeys('ArrowRight', down, { scopes: ['list'] }, [down])
  useHotkeys('ArrowLeft', up, { scopes: ['list'] }, [up])

  /* Clear selected item if it's not in the list anymore */
  useEffect(() => {
    if (selectedItemId && !nodeIds.includes(selectedItemId)) {
      selectId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIds, selectId])

  return { prev, next }
}
