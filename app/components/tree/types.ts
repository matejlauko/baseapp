import type { RefObject } from 'react'

export type ID = string | number

export type TreeItem<T = { [key: string]: unknown }> = T & {
  id: ID
  parentId: ID | null
  isExpanded: boolean | null
  order?: number | null
}

export type TreeItems<T = { [key: string]: unknown }> = TreeItem<T>[]

export type TreeNode<T = { [key: string]: unknown }> = TreeItem<T> & {
  index: number
  children: TreeNode<T>[]
  order: number
  depth: number
}

export type TreeNodes<T = { [key: string]: unknown }> = TreeNode<T>[]

export type SensorContext = RefObject<{
  nodes: TreeNodes
  nodesMap: Map<ID, TreeNode>
  offset: number
}>
