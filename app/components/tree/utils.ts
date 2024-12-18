import { arrayMove } from '@dnd-kit/sortable'
import type { ID, TreeItem, TreeItems, TreeNode, TreeNodes } from './types'

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export function getProjection<T>({
  nodes,
  nodesMap,
  activeId,
  dragOffset,
  indentationWidth,
  overId,
}: {
  nodes: TreeNodes<T>
  nodesMap: Map<ID, TreeNode<T>>
  activeId: ID
  overId: ID
  dragOffset: number
  indentationWidth: number
}): {
  parentId: ID | null
  depth: number
  maxDepth: number
  minDepth: number
} {
  const overItem = nodesMap.get(overId)!
  const activeItem = nodesMap.get(activeId)!

  const newItems = arrayMove(nodes, activeItem.index, overItem.index)

  const nextItem = newItems[overItem.index + 1]
  const previousItem = newItems[overItem.index - 1]

  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth

  const maxDepth = previousItem ? previousItem.depth + 1 : 0
  const minDepth = nextItem ? nextItem.depth : 0
  const depth = Math.max(minDepth, Math.min(maxDepth, projectedDepth))

  let parentId: ID | null = null

  if (depth === 0 || !previousItem) {
    parentId = null
  } else if (depth === previousItem.depth) {
    parentId = previousItem.parentId
  } else if (depth > previousItem.depth) {
    parentId = previousItem.id
  } else {
    parentId =
      newItems
        .slice(0, overItem.index)
        .reverse()
        .find(({ depth }) => depth === depth)?.parentId ?? null
  }

  return {
    parentId,
    depth,
    maxDepth,
    minDepth,
  }
}

export function moveItem<T>({
  items,
  nodesMap,
  activeId,
  overId,
  parentId,
  depth,
}: {
  items: TreeItems<T>
  nodesMap: Map<ID, TreeNode<T>>
  activeId: ID
  overId: ID
  parentId: ID | null
  depth: number
}): TreeItems<T> {
  const overItem = nodesMap.get(overId)!
  const activeItem = nodesMap.get(activeId)!
  const newItem: TreeItem<T> = { ...activeItem, parentId }

  console.log('MOVE', { activeItem, overItem, parentId, depth })

  if (activeItem.parentId === parentId) {
    const siblings = items.filter((item) => item.parentId === parentId)
    console.log(
      'Siblings',
      siblings.map((item) => [item.id])
    )

    // Add to new position
    siblings.splice(activeItem.order, 1)
    siblings.splice(overItem.order, 0, newItem)

    console.log(
      'Siblings',
      siblings.map((item) => [item.id])
    )

    const orderSiblings = siblings.map((item, idx) => ({ ...item, order: idx }))

    return orderSiblings
  }

  // Remove from past position
  const prevSiblings = items.filter((item) => item.parentId === activeItem.parentId)
  prevSiblings.splice(activeItem.order, 1)

  // Add to new position
  const newSiblings = items.filter((item) => item.parentId === parentId)

  newSiblings.splice(overItem.order, 0, newItem)

  const orderPrevSiblings = prevSiblings.map((item, idx) => ({ ...item, order: idx }))
  const orderNewSiblings = newSiblings.map((item, idx) => ({ ...item, order: idx }))

  return [...orderPrevSiblings, ...orderNewSiblings]
}

// function generateFlatNodes() {
//   let index = 0

//   function* flatNodesGenerator({
//     treeItems,
//     parentId = null,
//     depth = 0,
//   }: {
//     treeItems: TreeItems<T>
//     parentId?: ID | null
//     depth?: number
//   }): Generator<TreeNode<T>, void, unknown> {
//     const rootItems = treeItems.filter((item) => item.parentId === parentId)

//     for (let i = 0; i < rootItems.length; i++) {
//       const item = rootItems[i]
//       const children = item.isExpanded
//         ? [...flatNodesGenerator({ treeItems, parentId: item.id, depth: depth + 1 })]
//         : []

//       const node: TreeNode<T> = {
//         ...item,
//         children,
//         depth: depth,
//         index: index++,
//         // order: i,
//       }

//       nodesMap.current.set(item.id, node)
//       console.log('NODE', node)

//       yield node

//       for (let j = 0; j < children.length; j++) {
//         const child = children[j]
//         console.log('CHILD', child)
//         yield child
//       }
//     }
//   }

//   if (!items) return []

//   const generator = flatNodesGenerator({ treeItems: items })

//   return [...generator]
// }
