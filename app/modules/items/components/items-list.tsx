import { listStore } from '@/components/list/list-store'
import { useList } from '@/components/list/use-list'
import { cn } from '@/lib/ui/utils'
import { useSnapshot } from 'valtio'
import Item from './item'

function ItemsList() {
  const { selectedItemId } = useSnapshot(listStore)

  const { filteredItems: items } = useList()

  if (!items) return null

  return (
    <div role="list" className="flex flex-col gap-y-0.5 py-3">
      {items?.map((item) => {
        const isSelected = selectedItemId === item.id

        return (
          <div
            role="listitem"
            key={item.id}
            className={cn(
              'group/item hover:ring-neutral-a400 relative isolate rounded-lg hover:ring has-data-[state=open]:bg-neutral-100',
              isSelected && 'bg-neutral-100'
            )}
            data-selected={isSelected || undefined}
            aria-selected={isSelected}
          >
            <Item item={item} isSelected={isSelected} />
          </div>
        )
      })}
    </div>
  )
}

export default ItemsList
