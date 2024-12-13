'use client'

import { cn } from '@/lib/ui/utils'
import { useDebouncedCallback, useSyncedRef } from '@react-hookz/web'
import type { PlaceholderOptions } from '@tiptap/extension-placeholder'
import { useEditor as useTipTapEditor, type Editor, type EditorOptions } from '@tiptap/react'
import { useMemo } from 'react'
import { getExtensions } from './extensions'

export interface UseEditorOptions extends Partial<Omit<EditorOptions, 'onUpdate'>> {
  className?: string
  onDebouncedUpdate?: (editor: Editor) => void | Promise<void>
  /**
   * Default: 1000
   */
  debounceDuration?: number
  placeholder?: PlaceholderOptions['placeholder']
  shouldSubmitOnCmdEnter?: boolean
  shouldCancelOnEscape?: boolean
  shouldClearOnEscape?: boolean
  onSubmit?: () => void
  onCancel?: () => void
  onUpdate?: (editor: Editor) => void
}

export const useEditor = ({
  placeholder,
  className,
  onUpdate,
  onDebouncedUpdate,
  content,
  debounceDuration = 1000,
  editorProps,
  shouldSubmitOnCmdEnter = false,
  shouldCancelOnEscape = false,
  shouldClearOnEscape = false,
  onSubmit,
  onCancel,
  ...otherOptions
}: UseEditorOptions) => {
  const debouncedUpdates = useDebouncedCallback(
    async (editor: Editor) => {
      return onDebouncedUpdate?.(editor)
    },
    [onDebouncedUpdate],
    debounceDuration
  )

  const extensions = useMemo(
    () =>
      getExtensions({
        placeholder,
      }),
    [placeholder]
  )

  const editor = useTipTapEditor({
    ...otherOptions,
    extensions,
    content,
    editorProps: {
      attributes: {
        class: cn('Editor EditorContent', className),
      },
      handleKeyDown(_editorView, event) {
        const handled = editorProps?.handleKeyDown?.(_editorView, event)

        if (handled) return handled

        if (
          (shouldCancelOnEscape || shouldClearOnEscape) &&
          event.key === 'Escape' &&
          !event.metaKey &&
          !event.shiftKey &&
          !event.ctrlKey
        ) {
          if (shouldClearOnEscape) {
            editorRef.current?.chain().clearContent().blur().run()
          } else {
            editorRef.current?.commands.blur()
          }

          onCancel?.()
        } else if (
          shouldSubmitOnCmdEnter &&
          event.key === 'Enter' &&
          event.metaKey &&
          !event.shiftKey &&
          !event.ctrlKey
        ) {
          onSubmit?.()
        }
      },
    },
    onUpdate: (props) => {
      if (onDebouncedUpdate) {
        void debouncedUpdates(props.editor)
      }

      onUpdate?.(props.editor)
    },
  })

  const editorRef = useSyncedRef(editor)

  return editor
}
