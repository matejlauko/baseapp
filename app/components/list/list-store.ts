import { proxy } from 'valtio'

export const listStore = proxy<{
  selectedItemId: string | null
}>({
  selectedItemId: null,
})
