import { Link } from '@tiptap/extension-link'
import Placeholder, { type PlaceholderOptions } from '@tiptap/extension-placeholder'
import type { Extensions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

export function getExtensions({
  placeholder,
}: {
  placeholder?: PlaceholderOptions['placeholder']
}): Extensions {
  return [
    StarterKit.configure({
      hardBreak: false, // Disable soft line break (Shift+Enter)
    }),
    Link,
    placeholder && Placeholder.configure({ placeholder }),
    Markdown,
  ].filter(Boolean) as Extensions
}
