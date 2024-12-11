import { proxy } from 'valtio'

export interface ItemSearchTerms {
  content: string
  type?: string
  tags?: string[]
}

export const inputStore = proxy<{
  searchTerm: ItemSearchTerms
}>({
  searchTerm: {
    content: '',
    type: '',
    tags: [],
  },
})
