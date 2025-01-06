import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Modifier,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { dropAnimationConfig, measuring, pointerSensorOptions } from './config'
import { TreeItem, type TreeItemChildrenProps } from './tree-item'
import { sortableTreeKeyboardCoordinates } from './tree-keyboard-coordinates'
import type { ID, SensorContext, TreeItems, TreeNode, TreeNodes } from './types'
import { useTree } from './use-tree'
import { getProjection, moveItem } from './utils'

interface Props<T> {
  items: TreeItems<T>
  indentationWidth?: number
  onItemsChange: (items: T[]) => void
  children: (args: TreeItemChildrenProps<T>) => React.ReactElement
}

export function SortableTree<T>({
  items,
  indentationWidth = 50,
  onItemsChange,
  children,
}: Props<T>) {
  const { nodesMap, flatNodes, nodeIds } = useTree()

  const [activeId, setActiveId] = useState<ID | null>(null)
  const [overId, setOverId] = useState<ID | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const projected = useMemo(
    () =>
      activeId && overId
        ? getProjection({
            nodes: flatNodes,
            nodesMap,
            activeId,
            overId,
            dragOffset: offsetLeft,
            indentationWidth,
          })
        : null,
    [activeId, overId, offsetLeft, indentationWidth, flatNodes, nodesMap]
  )

  const sensorContext: SensorContext = useRef({
    nodes: flatNodes,
    nodesMap,
    offset: offsetLeft,
  })

  useEffect(() => {
    sensorContext.current = {
      nodes: flatNodes,
      nodesMap,
      offset: offsetLeft,
    }
  }, [flatNodes, nodesMap, offsetLeft])

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indentationWidth)
  )

  const sensors = useSensors(
    useSensor(PointerSensor, pointerSensorOptions),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  )

  const activeItem = activeId ? nodesMap.get(activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
        <>
          {(flatNodes as TreeNodes<T>).map((item) => (
            <TreeItem
              key={item.id}
              id={item.id}
              item={item}
              children={children}
              indentationWidth={indentationWidth}
              depth={item.id === activeId && projected ? projected.depth : item.depth}
            />
          ))}

          {createPortal(
            <DragOverlay dropAnimation={dropAnimationConfig} modifiers={[adjustTranslate]}>
              {activeId && activeItem ? (
                <TreeItem
                  id={activeId}
                  item={activeItem as TreeNode<T>}
                  isClone
                  children={children}
                  indentationWidth={indentationWidth}
                  depth={activeItem.depth}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </>
      </SortableContext>
    </DndContext>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId)
    setOverId(activeId)

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()

    if (projected && over) {
      const newItems = moveItem({
        items,
        nodesMap: nodesMap as Map<ID, TreeNode<T>>,
        activeId: active.id,
        overId: over.id,
        parentId: projected.parentId,
        depth: projected.depth,
      })

      onItemsChange(newItems as T[])
    }
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)

    document.body.style.setProperty('cursor', '')
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  }
}
