import { proxy } from 'valtio'
import type { ID } from './types'

export const treeStore = proxy<{
  selectedItemId: ID | null
}>({
  selectedItemId: null,
})
