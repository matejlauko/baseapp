import { proxy } from 'valtio'

export const listStore = proxy<{
  selectedItemId: string | null
  selectItemIndex: number | null
}>({
  selectedItemId: null,
  selectItemIndex: null,
})
