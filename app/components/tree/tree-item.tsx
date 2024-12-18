import { isIOS } from '@/lib/browser'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { type CSSProperties } from 'react'
import { animateLayoutChanges } from './config'
import type { ID, TreeNode } from './types'

type SortableProps = ReturnType<typeof useSortable>

type OwnItemChildrenProps<T> = {
  id: ID
  item: TreeNode<T>
  childCount?: number
  isClone?: boolean
  depth: number
}

export interface TreeItemChildrenProps<T>
  extends OwnItemChildrenProps<T>,
    Omit<SortableProps, 'attributes'> {
  attributes: SortableProps['attributes'] & {
    tabIndex: number
  }
  itemStyle: CSSProperties
  wrapperStyle: CSSProperties
}

export interface Props<T> extends OwnItemChildrenProps<T> {
  children: (args: TreeItemChildrenProps<T>) => React.ReactElement
  indentationWidth: number
}

export function TreeItem<T>({
  id,
  item,
  childCount,
  isClone = false,
  depth,
  indentationWidth,
  children,
}: Props<T>) {
  const sortableProps = useSortable({
    id,
    animateLayoutChanges,
  })

  const { transform, transition, isSorting } = sortableProps

  const disableInteraction = isSorting
  const disableSelection = isClone || isIOS()

  const itemStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    pointerEvents: disableInteraction ? 'none' : 'initial',
    userSelect: disableSelection ? 'none' : 'initial',
    WebkitUserSelect: disableSelection ? 'none' : 'initial',
    '--item-spacing': `${indentationWidth * depth}px`,
  } as CSSProperties

  const wrapperStyle = {
    '--item-spacing': `${indentationWidth * depth}px`,
  } as CSSProperties

  const childrenProps: TreeItemChildrenProps<T> = {
    ...sortableProps,
    attributes: {
      ...sortableProps.attributes,
      tabIndex: -1,
    },
    itemStyle,
    wrapperStyle,
    id,
    item,
    isClone,
    childCount,
    depth,
  }

  return children(childrenProps)
}
