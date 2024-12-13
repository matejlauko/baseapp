import { filterAndSortList, FilterRankings } from '@os/utils'
import type { Items } from './items'
import type { ItemSearchTerms } from './store'

export function filterItems(items: Items, searchTerms: ItemSearchTerms): Items {
  const { content, type, tags } = searchTerms

  console.log('foo searchhc', content, type, tags)

  return filterAndSortList(items, content, {
    keys: ['title', 'text', 'type', 'tags'],
    //  If the item contains the given value (ex. ham would match Bahamas)
    threshold: FilterRankings.CONTAINS,
    // use the original index of items as the tie breaker
    baseSort: (a, b) => (a.index < b.index ? -1 : 1),
  })

  // .filter((item) => {
  //   // Additional filtering based on parsed tags and type
  //   const matchesTags = tags.length ? tags.every((tag) => item.tags.includes(tag)) : true
  //   const matchesType = type ? item.type === type : true
  //   return matchesTags && matchesType
  // })
}
