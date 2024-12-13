import { type Editor } from '@tiptap/react'
import * as React from 'react'

export const EditorContext = React.createContext<Editor>(undefined as unknown as Editor)

export const useEditorContext = () => React.useContext(EditorContext)
