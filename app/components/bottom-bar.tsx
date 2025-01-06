import type { PropsWithChildren } from 'react'

export function BottomBar({ children }: PropsWithChildren) {
  return (
    <div className="items-centergap-2 bg-background/80 fixed right-0 bottom-0 left-0 flex h-(--bottom-bar-height) px-4 py-2 opacity-40 backdrop-blur-sm transition-opacity ease-out hover:opacity-100 md:px-8">
      {children}
    </div>
  )
}
