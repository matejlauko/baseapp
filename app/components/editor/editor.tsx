'use client'

import { cn } from '@/lib/ui/utils'
import { EditorContent, EditorContext, type Editor as EditorClass } from '@tiptap/react'
import { memo } from 'react'

export type EditorProps = {
  editor: EditorClass | null
  children?: React.ReactNode
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>

export const Editor = memo(function Editor({
  editor,
  children,
  className,
  ...restProps
}: EditorProps) {
  if (!editor) return null

  return (
    <div {...restProps} className={cn('EditorContainer relative', className)}>
      <EditorContext value={{ editor }}>
        {children}

        <EditorContent editor={editor} />
      </EditorContext>
    </div>
  )
})
