import { ListProvider } from '@/components/list/list-provider'
import { useSub } from '@/lib/db/use-db'
import ItemInput from '@/modules/input/components/item-input'
import ItemsList from '@/modules/items/components/items-list'
import { listItems } from '@/modules/items/queries'
import { createFileRoute } from '@tanstack/react-router'

import '@/components/editor/styles/editor.css'

export const Route = createFileRoute('/_app/')({
  component: AppPage,
})

function AppPage() {
  const items = useSub(listItems)

  return (
    <>
      <div className="mb-(--bottom-bar-height) flex min-h-dvh flex-col py-8" data-selected="1">
        <ListProvider items={items}>
          <div className="fixed top-0 right-0 left-0 z-1 min-h-20 pt-8 before:absolute before:inset-0 before:h-8 before:backdrop-blur-md [body[data-scroll-locked]_&]:mr-(--removed-body-scroll-bar-size)">
            <div className="container">
              <ItemInput />
            </div>
          </div>
          <div className="h-12" />

          <div className="container">{items && <ItemsList />}</div>
        </ListProvider>
      </div>
    </>
  )
}
