import { createContext } from 'react'
import type { ID, TreeItems, TreeNode } from './types'

export interface TreeContextType<T = { [key: string]: unknown }> {
  items?: TreeItems<T>
  selectId: (id: ID | null) => void
  selectFirst: () => void
  nodesMap: Map<ID, TreeNode<T>>
  nodeIds: ID[]
  flatNodes: TreeNode<T>[]
}

export const TreeContext = createContext<TreeContextType>(undefined as unknown as TreeContextType)
