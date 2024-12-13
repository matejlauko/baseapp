'use client'

import { cn } from '@/lib/ui/utils'
import { EditorContent, type Editor as EditorClass } from '@tiptap/react'
import * as React from 'react'
import { EditorContext } from './editor-context'

export type EditorProps = {
  editor: EditorClass | null
  children?: React.ReactNode
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>

export const Editor = ({ editor, children, className, ...restProps }: EditorProps) => {
  if (!editor) return null

  return (
    <div {...restProps} className={cn('EditorContainer relative', className)}>
      <EditorContext.Provider value={editor}>
        {children}

        <EditorContent editor={editor} />
      </EditorContext.Provider>
    </div>
  )
}
