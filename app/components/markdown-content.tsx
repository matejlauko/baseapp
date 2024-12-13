import type { ComponentPropsWithoutRef } from 'react'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'

interface Props extends ComponentPropsWithoutRef<typeof ReactMarkdown> {
  children: string
}

function MarkdownContentComponent({ children, ...props }: Props) {
  return <ReactMarkdown {...props}>{children}</ReactMarkdown>
}

export const MarkdownContent = memo(
  MarkdownContentComponent,
  (prevProps, nextProps) => prevProps.children === nextProps.children
)
