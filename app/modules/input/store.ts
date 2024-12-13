import { proxy } from 'valtio'

export const inputStore = proxy<{
  searchTerm: string
}>({
  searchTerm: '',
})
