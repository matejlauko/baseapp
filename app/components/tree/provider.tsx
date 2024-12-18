import { useCallback, useMemo, useRef, type PropsWithChildren } from 'react'
import { TreeContext, type TreeContextType } from './context'
import { treeStore } from './store'
import type { ID, TreeItems, TreeNode } from './types'

export const TreeProvider = <T = { [key: string]: unknown },>({
  items,
  children,
}: PropsWithChildren<{ items?: TreeItems<T> }>) => {
  const nodesMap = useRef<Map<ID, TreeNode<T>>>(new Map())

  function generateFlatNodes(_items: TreeItems<T>) {
    let index = 0

    function buildFlatNodes(parentId: ID | null = null, depth = 0): TreeNode<T>[] {
      const rootItems = _items.filter((item) => item.parentId === parentId)

      const nodes: TreeNode<T>[] = []

      for (let i = 0; i < rootItems.length; i++) {
        const item = rootItems[i]

        const node: TreeNode<T> = {
          ...item,
          children: [],
          depth: depth,
          index: index++,
          order: i,
        }

        const children = item.isExpanded ? [...buildFlatNodes(item.id, depth + 1)] : []

        node.children = children

        nodesMap.current.set(item.id, node)

        nodes.push(node, ...children)
      }

      return nodes
    }

    return buildFlatNodes()
  }

  const flatNodes = useMemo(() => {
    return items ? generateFlatNodes(items) : []
  }, [items])

  const nodeIds = useMemo(() => flatNodes.map(({ id }) => id), [flatNodes])

  const selectId = useCallback((id: ID | null) => {
    treeStore.selectedItemId = id
  }, [])

  const selectFirst = useCallback(() => {
    treeStore.selectedItemId = flatNodes[0].id
  }, [flatNodes])

  const contextValue: TreeContextType<T> = {
    items,
    nodesMap: nodesMap.current,
    flatNodes,
    nodeIds,
    selectId,
    selectFirst,
  }

  // @ts-expect-error context generic
  return <TreeContext value={contextValue}>{children}</TreeContext>
}
