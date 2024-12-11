import { useMutation } from '@/lib/db/use-db'
import { getLogger } from '@/lib/logger'
import { Checkbox } from '@/lib/ui/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/lib/ui/context-menu'
import { useToast } from '@/lib/ui/use-toast'
import { useNavigate } from '@tanstack/react-router'
import { format as formatDate } from 'date-fns'
import { CopyIcon, TrashIcon } from 'lucide-react'
import * as React from 'react'
import { ItemType, type Item } from '../item'
import { createItemMutation, deleteItemMutation, updateItemMutation } from '../mutators'
import ItemIcon from './item-icon'

interface Props {
  item: Item
  isSelected: boolean
}

const { captureError } = getLogger('item')

const Item: React.FC<Props> = ({ item, isSelected }) => {
  const navigate = useNavigate()
  const createItem = useMutation(createItemMutation)
  const deleteItem = useMutation(deleteItemMutation)
  const updateItem = useMutation(updateItemMutation)
  const { toast } = useToast()

  const handleDuplicateItem = async (duplicatedItem: Item) => {
    if (await createItem(duplicatedItem)) {
      toast({
        title: 'Item duplicated',
      })
    } else {
      toast({
        title: 'Failed to duplicate item',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (await deleteItem(itemId)) {
      toast({
        title: 'Item deleted',
      })
    } else {
      toast({
        title: 'Failed to delete item',
        variant: 'destructive',
      })
    }

    if (isSelected) {
      navigate({ to: '/' })
    }
  }

  const handleTaskCompletedChange = async (checked: boolean) => {
    updateItem({
      id: item.id,
      completed: checked,
    })
  }

  // Format date to user friendly format
  // Omit year if it's the current year
  const getCreatedAt = (date: string) => {
    const currentYear = new Date().getFullYear()
    const dateYear = new Date(date).getFullYear()

    return dateYear === currentYear
      ? formatDate(new Date(date), 'MMM d')
      : formatDate(new Date(date), 'MMM d, yyyy')
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="group/item relative flex min-h-10 items-center gap-x-3 gap-y-1 px-3 py-2">
          <div className="grid w-4">
            {item.type === ItemType.Task ? (
              <div className="grid place-content-center">
                <Checkbox
                  aria-label="Toggle task done"
                  onCheckedChange={handleTaskCompletedChange}
                />
              </div>
            ) : (
              <ItemIcon type={item.type} />
            )}
          </div>

          <div className="flex-1 select-text">
            {/* <MarkdownContent className="font-medium">{item.title}</MarkdownContent> */}
            <div className="font-medium">{item.text}</div>
          </div>

          {/* <div className="flex items-center gap-x-1">
        {item.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div> */}

          <div className="">
            <span className="text-sm text-neutral-800">{getCreatedAt(item.createdAt)}</span>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onMouseUp={(event) => {
          event.stopPropagation() // Prevent opening detail
        }}
      >
        <ContextMenuItem
          onSelect={(event) => {
            event.stopPropagation()

            handleDuplicateItem(item)
          }}
        >
          <CopyIcon className="mr-2" size={18} />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          color="red"
          onSelect={(event) => {
            event.stopPropagation()
            event.stopImmediatePropagation()

            handleDeleteItem(item.id)
          }}
        >
          <TrashIcon className="mr-2" size={18} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default Item

// const markdownComponents: MarkdownComponents = {
//   span: ({ node, ...props }) => {
//     if (node?.properties?.['data-type'] === 'tag' && typeof props.children === 'string') {
//       return <Tag>{props.children}</Tag>
//     }

//     return <span {...props} />
//   },
// }
