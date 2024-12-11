import { useMutation } from '@/lib/db/use-db'
import { getLogger } from '@/lib/logger'
import { createItemMutation } from '@/modules/items/mutators'
import { useSyncedRef } from '@react-hookz/web'
import * as React from 'react'
import { useSnapshot } from 'valtio'
import { inputStore } from '../store'

import { DEFAULT_ITEM_TYPE } from '@/modules/items/item'
import './input.css'

const { captureError } = getLogger('input')

const ItemInput: React.FC = () => {
  const createItem = useMutation(createItemMutation)
  const inputState = useSnapshot(inputStore)

  const handleSubmit = () => {
    const content = editorRef.current?.storage.markdown.getMarkdown()?.trim()

    if (!content) return

    try {
      void createItem({
        text: content,
        type: DEFAULT_ITEM_TYPE,
      })
    } catch (error) {
      captureError('handleSubmit - createItem', error)
    }

    editorRef.current?.commands.setContent('')
  }

  const editor = useFullEditor({
    placeholder: 'Idea, task, note…',
    shouldCancelOnEscape: true,
    extensions: getTagExtensions(),
    editorProps: {
      handleKeyDown(_editorView, event) {
        if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
          event.preventDefault()

          handleSubmit()

          // Prevent default behavior - don't insert new line
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText()

      console.log('content', content)

      // Used just to reset search immediately if the value is empty
      if (!content) {
        itemsStore.searchTerm = {
          content: '',
          type: '',
          tags: [],
        }
      }
    },
    onDebouncedUpdate: (editor) => {
      const content = editor.storage.markdown.getMarkdown() as string

      const parsedItemData = parseItemVal(content)

      itemsStore.searchTerm = {
        content: parsedItemData.title,
        type: parsedItemData.type,
        tags: parsedItemData.tags,
      }
    },
  })

  const editorRef = useSyncedRef(editor)

  const handleTypeChange = (type: ItemType) => {
    inputStore.type = type
  }

  const handleAddTag = (tag: string) => {
    inputStore.tags.push(tag)
  }

  const handleDeleteTag = (tag: string) => {
    inputStore.tags = inputStore.tags.filter((t) => t !== tag)
  }

  const hasContent = Boolean(editorRef.current?.getText().trim())

  return (
    <div className="bg-panel-solid flex flex-col rounded">
      <FullEditor
        editor={editor}
        className="Input bg-panel-translucent focus-within:ring-focus-a600 rounded shadow-sm focus-within:ring"
      />

      <div className="flex h-7 items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <ItemTypeSelect currentType={inputState.type} onChange={handleTypeChange} />

          <ItemTagsSelect
            tagOptions={allTags}
            selectedTags={inputState.tags}
            onAddTag={handleAddTag}
            onDeleteTag={handleDeleteTag}
          />
        </div>

        <div className="flex items-center">
          {hasContent ? (
            <>
              <Kbd>Enter</Kbd>&nbsp;
              <Text size="1" className="text-gray-800">
                to add
              </Text>
            </>
          ) : (
            <>
              <Text size="1" className="text-gray-800">
                Add new or search
              </Text>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemInput
