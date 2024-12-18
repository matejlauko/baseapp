import { useListNav } from '@/components/list/use-list-nav'
import { SortableTree } from '@/components/tree/sortable-tree'
import { treeStore } from '@/components/tree/store'
import { useTree } from '@/components/tree/use-tree'
import { useMutation } from '@/lib/db/use-db'
import { shallowEqual } from '@/lib/utils'
import { cva } from 'cva'
import type { CSSProperties } from 'react'
import { useSnapshot } from 'valtio'
import { type Item as IItem } from '../items'
import { updateItemMutation } from '../mutators'
import Item from './item'

const ITEM_HEIGHT_PX = 40

const wrapperStyles = cva({
  base: 'pl-(--item-spacing) -mb-px relative isolate',
  variants: {
    isClone: {
      true: 'w-fit px-2',
    },
    isDragging: {
      true: 'z-10',
    },
  },
})

const treeItemStyles = cva({
  base: 'rounded-lg',
  variants: {
    isClone: {
      true: 'bg-neutral-200/90 font-medium text-foreground flex items-center text-sm shadow-lg',
      false:
        'group/item hover:ring-neutral-a400 rounded-lg hover:ring has-data-[state=open]:bg-neutral-100',
    },
    isSelected: {
      true: 'bg-neutral-100',
    },
    isDragging: {
      true: 'h-1 border bg-accent-a600 [&>*]:opacity-0 [&>*]:h-0',
    },
  },
})

function ItemsList() {
  const { selectedItemId } = useSnapshot(treeStore)
  const { items } = useTree<IItem>()
  const updateItem = useMutation(updateItemMutation)

  useListNav()

  if (!items) return null

  const handleItemsChange = async (newItems: IItem[]) => {
    for (const newItem of newItems) {
      const oldItem = items.find((item) => item.id === newItem.id)
      if (oldItem && shallowEqual(oldItem, newItem)) {
        continue
      }

      updateItem(newItem)
    }
  }

  return (
    <div
      role="list"
      className="flex flex-col gap-y-0.5 py-3"
      style={{ '--item-height': `${ITEM_HEIGHT_PX}px` } as CSSProperties}
    >
      <SortableTree<IItem> items={items} onItemsChange={handleItemsChange}>
        {({
          id,
          item,
          // childCount,
          isClone,
          itemStyle,
          wrapperStyle,
          attributes,
          listeners,
          setDraggableNodeRef,
          setDroppableNodeRef,
          isDragging,
        }) => {
          const isSelected = selectedItemId === id

          return (
            <div
              ref={setDroppableNodeRef}
              role="listitem"
              style={wrapperStyle}
              className={wrapperStyles({ isClone, isDragging })}
            >
              <div
                {...attributes}
                {...listeners}
                ref={setDraggableNodeRef}
                style={{ ...itemStyle, height: isDragging ? undefined : `${ITEM_HEIGHT_PX}px` }}
                className={treeItemStyles({ isSelected, isClone, isDragging })}
                data-selected={isSelected || undefined}
                aria-selected={isSelected}
              >
                {!isDragging && !isClone && <Item item={item} isSelected={isSelected} />}
                {isClone && item.text}
              </div>
            </div>
          )
        }}
      </SortableTree>
    </div>
  )
}

export default ItemsList
