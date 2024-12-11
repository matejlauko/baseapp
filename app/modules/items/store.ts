import { proxy } from 'valtio'

export interface ItemSearchTerms {
  content: string
  type?: string
  tags?: string[]
}

export const itemsStore = proxy<{
  searchTerm: ItemSearchTerms
  allTags: string[]
}>({
  searchTerm: {
    content: '',
    type: '',
    tags: [],
  },
  allTags: [],
})
