import { Editor } from '@/components/editor/editor'
import { useCreateEditor } from '@/components/editor/use-create-editor'
import { listStore } from '@/components/list/list-store'
import { useList } from '@/components/list/use-list'
import { useMutation } from '@/lib/db/use-db'
import { getLogger } from '@/lib/logger'
import { cn } from '@/lib/ui/utils'
import { DEFAULT_ITEM_TYPE } from '@/modules/items/items'
import { createItemMutation } from '@/modules/items/mutators'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { inputStore } from '../store'

const { captureError } = getLogger('input')

function ItemInput() {
  const createItem = useMutation(createItemMutation)
  const { selectedItemId } = useSnapshot(listStore)
  const { selectNext } = useList()

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
        inputStore.searchTerm = content
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
        selectNext()
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

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor, selectNext])

  /* Focus when no item is selected, blur when an item is selected */
  useEffect(() => {
    if (selectedItemId) {
      editor?.commands.blur()
    } else {
      editor?.commands.focus()
    }
  }, [editor, selectedItemId])

  return (
    <div className="bg-panel ring-line has-focus:ring-accent-a400 border-line flex flex-col rounded-md ring-2 shadow-sm transition-colors has-focus:ring-2">
      <Editor
        editor={editor}
        className={cn(
          'ItemInput [&_.Editor]:min-h-8 [&_.Editor]:ps-3 [&_.Editor]:pe-12 [&_.Editor]:pt-2 [&_.Editor]:pb-4 [&_.Editor]:font-medium'
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
