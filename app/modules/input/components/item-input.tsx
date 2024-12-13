import { Editor } from '@/components/editor/editor'
import { useEditor } from '@/components/editor/use-editor'
import { listStore } from '@/components/list/list-store'
import { useList } from '@/components/list/use-list'
import { useMutation } from '@/lib/db/use-db'
import { getLogger } from '@/lib/logger'
import { cn } from '@/lib/ui/utils'
import { DEFAULT_ITEM_TYPE } from '@/modules/items/items'
import { createItemMutation } from '@/modules/items/mutators'
import { useEffect, useImperativeHandle } from 'react'
import { useSnapshot } from 'valtio'
import { inputStore } from '../store'

const { captureError } = getLogger('input')

export interface ItemInputApi {
  focus: () => void
  blur: () => void
  isFocused: () => boolean
  hasContent: () => boolean
}

function ItemInput() {
  const createItem = useMutation(createItemMutation)
  const { selectedItemId } = useSnapshot(listStore)

  const handleSubmit = () => {
    const content = editor?.storage.markdown.getMarkdown()?.trim()

    if (!content) return

    try {
      void createItem({
        text: content,
        type: DEFAULT_ITEM_TYPE,
      })
    } catch (error) {
      captureError('handleSubmit - createItem', error)
    }

    setTimeout(() => {
      editor?.commands.clearContent()
      inputStore.searchTerm = ''
    })
  }

  const editor = useEditor({
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
        inputStore.searchTerm = content
      }
    },
    debounceDuration: 150,
  })

  const { itemInputRef } = useList()

  useImperativeHandle(itemInputRef, (): ItemInputApi => {
    return {
      focus: () => {
        editor?.commands.focus()
      },
      blur: () => {
        editor?.commands.blur()
      },
      isFocused: () => {
        return editor?.isFocused ?? false
      },
      hasContent: () => {
        return Boolean(editor?.getText().trim())
      },
    }
  }, [editor])

  /**
   * Starts writing in the editor when pressing a letter or a number wherever.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // If user is focused on editor, has has more content than 1 paragraph, stop other keyboard events (list nav)
      if (editor?.isFocused && editor?.state.doc.childCount > 1) {
        event.stopImmediatePropagation()
      }

      // If user is focused out and pressed a letter or a number key, focus the editor, without
      if (
        !editor?.isFocused &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault()

        const lastPosition = (editor?.state.doc.content.size || 1) - 1
        editor?.chain().focus().insertContentAt(lastPosition, event.key).run()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  return (
    <div className="bg-panel flex flex-col rounded-md shadow-sm">
      <Editor
        editor={editor}
        className={cn(
          'ItemInput [&_.Editor]:min-h-8 [&_.Editor]:ps-3 [&_.Editor]:pe-12 [&_.Editor]:pt-2 [&_.Editor]:pb-4 [&_.Editor]:font-medium',
          !selectedItemId && 'ring-accent-a400 has-focus:ring-2'
        )}
      />

      {/* <div className="flex h-7 items-center justify-between px-2">
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
      </div> */}
    </div>
  )
}

export default ItemInput
