import { inputStore } from '@/modules/input/store'
import type { Item } from '@/modules/items/items'
import { matchSorter, type MatchSorterOptions } from 'match-sorter'
import { useMemo } from 'react'
import { useSnapshot } from 'valtio'

const options: MatchSorterOptions<Item> = {
  keys: ['text'],
  threshold: matchSorter.rankings.CONTAINS,
  keepDiacritics: false,
}

export function filterItems(items: Item[], searchTerm: string): Item[] {
  if (!searchTerm.trim()) return items

  return matchSorter<Item>(items, searchTerm, options)
}

export const useFilterItems = (items: Item[]): Item[] => {
  const { searchTerm } = useSnapshot(inputStore)

  const filteredItems = useMemo(() => filterItems(items, searchTerm), [items, searchTerm])

  return filteredItems
}
