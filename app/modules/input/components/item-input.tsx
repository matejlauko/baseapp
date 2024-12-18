import { Editor } from '@/components/editor/editor'
import { useCreateEditor } from '@/components/editor/use-create-editor'
import { treeStore } from '@/components/tree/store'
import { useTree } from '@/components/tree/use-tree'
import { useMutation } from '@/lib/db/use-db'
import { getLogger } from '@/lib/logger'
import { cn } from '@/lib/ui/utils'
import { DEFAULT_ITEM_TYPE, ItemType } from '@/modules/items/items'
import { createItemMutation } from '@/modules/items/mutators'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { inputStore } from '../store'
import ItemTypeSelect from './item-type-select'

const { captureError } = getLogger('input')

function ItemInput() {
  const createItem = useMutation(createItemMutation)
  const { selectedItemId } = useSnapshot(treeStore)
  const { selectFirst } = useTree()
  const [type, setType] = useState<ItemType | undefined>(undefined)

  const handleSubmit = () => {
    const content = editor?.storage.markdown.getMarkdown()?.trim()

    if (!content) return

    const { text, type } = parseItem(content)

    try {
      void createItem({
        text,
        type: type || DEFAULT_ITEM_TYPE,
      })
    } catch (error) {
      captureError('handleSubmit - createItem', error)
    }

    setTimeout(() => {
      editor?.commands.clearContent()
      inputStore.searchTerm = ''
    })
  }

  const editor = useCreateEditor({
    placeholder: 'Idea, task, note…',
    shouldCancelOnEscape: true,
    shouldSubmitOnCmdEnter: true,
    autofocus: 'end',
    editorProps: {},
    onSubmit: handleSubmit,
    onUpdate: (editor) => {
      const content = editor.getText().trim()

      // Reset search immediately if the value is empty
      if (!content) {
        inputStore.searchTerm = ''
      }
    },
    onDebouncedUpdate: (editor) => {
      const content = editor.getText().trim()

      if (content) {
        const { text, type } = parseItem(content)

        inputStore.searchTerm = text

        setType(type || undefined)
      } else {
        setType(undefined)
      }
    },
    debounceDuration: 150,
  })

  /* Starts writing in the editor when pressing a letter or a number wherever */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // When pressing down arrow, select next item, but only if the editor doesn't have more than 1 paragraph
      if (event.key === 'ArrowDown' && editor?.isFocused && editor?.state.doc.childCount <= 1) {
        event.preventDefault()
        selectFirst()
      }

      // If user is focused out and pressed a letter or a number key, focus the editor, without
      if (
        !editor?.isFocused &&
        event.key.length === 1 &&
        !['[', ']'].includes(event.key) && // TODO: figure out how to stop commander propagation
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault()

        const lastPosition = (editor?.state.doc.content.size || 1) - 1
        editor?.chain().focus().insertContentAt(lastPosition, event.key).run()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, selectFirst])

  /* Focus when no item is selected, blur when an item is selected */
  useEffect(() => {
    if (selectedItemId) {
      editor?.commands.blur()
    } else {
      editor?.commands.focus()
    }
  }, [editor, selectedItemId])

  const hasContent = editor?.getText().trim()

  return (
    <div className="bg-panel ring-line has-focus:ring-accent-a400 border-line flex flex-col rounded-md ring-1 shadow-sm transition-colors has-focus:ring-2">
      <Editor
        editor={editor}
        className={cn(
          'ItemInput [&_.Editor]:min-h-8 [&_.Editor]:ps-3 [&_.Editor]:pe-12 [&_.Editor]:pt-2 [&_.Editor]:pb-4 [&_.Editor]:font-medium'
        )}
      />

      <div
        className="flex h-8 items-center py-1 ps-1 pe-2"
        onClick={() => editor?.commands.focus()}
      >
        <div className="grow">
          <ItemTypeSelect
            currentType={type}
            onChange={setType}
            onClose={() => editor?.commands.focus()}
          />
        </div>

        <div className="flex shrink-0 items-center">
          {hasContent ? (
            <>
              <span className="bg-muted text-muted-foreground mr-0.5 ml-auto rounded-sm border px-1 py-px text-xs font-medium tracking-wide">
                Cmd
              </span>
              <span className="bg-muted text-muted-foreground ml-auto rounded-sm border px-1 py-px text-xs font-medium tracking-wide">
                Enter
              </span>
              &nbsp;
              <span className="text-muted-foreground text-xs">to add</span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground text-xs">Add new item or search</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemInput

const typeRegex = new RegExp(`^(${Object.values(ItemType).join('|')}):`)

function parseItem(input: string): {
  type: ItemType | undefined
  text: string
} {
  const typeMatch = input.match(typeRegex)

  const type = typeMatch ? (typeMatch[1] as ItemType) : undefined
  const text = type ? input.replace(typeRegex, '') : input

  return {
    type,
    text,
  }
}
