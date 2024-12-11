import { useSub } from '@/lib/db/use-db'
import { cn } from '@/lib/ui/utils'
import * as React from 'react'
import { useSnapshot } from 'valtio'
import { listItems } from '../queries'
import { itemsStore } from '../store'
import Item from './item'

interface Props {
  selectedItemId?: string
}

const ItemsList: React.FC<Props> = ({ selectedItemId }) => {
  const items = useSub(listItems)
  const searchTerm = useSnapshot(itemsStore).searchTerm

  const filteredItems = items

  // const filteredItems = useMemo(() => {
  //   console.log('searchTerm', searchTerm)

  //   if (!items || (!searchTerm.content && !searchTerm.type && !searchTerm.tags?.length))
  //     return items

  //   return filterItems(items, searchTerm as ItemSearchTerms)
  // }, [items, searchTerm])

  console.log('items', { items, filteredItems })

  if (!items) return null

  // const handleSelectItem = (item: Item) => {
  //   navigate(`/${item.id}`)
  // }

  return (
    <div className="flex flex-col gap-y-0.5 py-3">
      {filteredItems?.map((item) => (
        <div
          key={item.id}
          className={cn(
            'group/item relative isolate rounded-lg transition-colors duration-[25ms] ease-out hover:bg-neutral-100 has-data-[state=open]:bg-neutral-100'
          )}
        >
          <Item item={item} isSelected={selectedItemId === item.id} />
        </div>
      ))}
    </div>
  )
}

export default ItemsList
