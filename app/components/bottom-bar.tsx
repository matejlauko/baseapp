import type { PropsWithChildren } from 'react'

export function BottomBar({ children }: PropsWithChildren) {
  return (
    <div className="fixed right-0 bottom-0 left-0 h-(--bottom-bar-height) px-4 py-2 md:px-8">
      {children}
    </div>
  )
}
