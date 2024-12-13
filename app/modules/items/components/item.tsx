import { addCommands, removeCommands, type Command } from '@/components/commander/commander-store'
import { useList } from '@/components/list/use-list'
import { MarkdownContent } from '@/components/markdown-content'
import { useMutation } from '@/lib/db/use-db'
import { Checkbox } from '@/lib/ui/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/lib/ui/context-menu'
import { useToast } from '@/lib/ui/use-toast'
import { skipMaybe } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import { format as formatDate } from 'date-fns'
import { CopyIcon, StickyNoteIcon, TrashIcon } from 'lucide-react'
import { memo, useEffect, useLayoutEffect, useRef } from 'react'
import { usePress } from 'react-aria'
import { ItemType, type Item as IItem } from '../items'
import { createItemMutation, deleteItemMutation, updateItemMutation } from '../mutators'

interface Props {
  item: IItem
  isSelected: boolean
}

function Item({ item, isSelected }: Props) {
  const itemRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const createItem = useMutation(createItemMutation)
  const deleteItem = useMutation(deleteItemMutation)
  const updateItem = useMutation(updateItemMutation)
  const { toast } = useToast()
  const { selectItem } = useList()

  const handleDuplicateItem = async (duplicatedItem: IItem) => {
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

  /* Scroll item into view when selected */
  useLayoutEffect(() => {
    if (isSelected) {
      itemRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [isSelected])

  /* Commands */
  useEffect(() => {
    const commands: Command[] = [
      {
        name: `Delete item - ${item.text}`,
        icon: TrashIcon,
        hotkey: 'meta+backspace',
        action: () => handleDeleteItem(item.id),
      },
      {
        name: `Duplicate item - ${item.text}`,
        icon: CopyIcon,
        hotkey: 'meta+d',
        action: () => handleDuplicateItem(item),
      },
    ].filter(skipMaybe)

    if (isSelected) {
      addCommands(commands)
    }

    return () => {
      removeCommands(commands)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected])

  const { pressProps } = usePress({
    onPress: () => {
      selectItem(item.id)
    },
  })

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
        <div
          className="group/item relative flex min-h-10 scroll-m-4 gap-x-3 gap-y-1 px-3 py-2"
          {...pressProps}
          ref={itemRef}
        >
          <div className="mt-1 w-4">
            {item.type === ItemType.Task ? (
              <div className="grid place-content-center">
                <Checkbox
                  aria-label="Toggle task done"
                  onCheckedChange={handleTaskCompletedChange}
                />
              </div>
            ) : (
              <StickyNoteIcon className="text-neutral-800" size={16} aria-label="Note type" />
            )}
          </div>

          <div className="flex-1 select-text">
            <MarkdownContent className="EditorContent font-medium">{item.text}</MarkdownContent>
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
          onSelect={() => {
            handleDuplicateItem(item)
          }}
        >
          <CopyIcon className="mr-2" size={18} />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          color="red"
          onSelect={() => {
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

export default memo(Item)

// const markdownComponents: MarkdownComponents = {
//   span: ({ node, ...props }) => {
//     if (node?.properties?.['data-type'] === 'tag' && typeof props.children === 'string') {
//       return <Tag>{props.children}</Tag>
//     }

//     return <span {...props} />
//   },
// }
