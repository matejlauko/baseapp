import { useDB, useMutation, useSub } from '@/lib/db/use-db'
import { ItemType } from '@/modules/items/item'
import { createItemMutation } from '@/modules/items/mutators'
import { listItems } from '@/modules/items/queries'
import { format } from 'date-fns'
import * as React from 'react'

interface Props {}

const Test: React.FC<Props> = ({}) => {
  const db = useDB()
  const itemsList = useSub(listItems)
  const addItem = useMutation(createItemMutation)

  console.log({ itemsList })

  const handleAdd = () => {
    addItem({
      text: 'test1',
      type: ItemType.Note,
      tags: ['tag1'],
    })
  }

  return (
    <>
      <h3>gfds Homgfde!</h3>

      <button onClick={handleAdd}>Add item</button>

      {itemsList?.map((item) => (
        <div key={item.id}>
          {item.text} : {format(item.updatedAt ?? item.createdAt, 'yyyy-MM-dd HH:mm:ss')}
        </div>
      ))}
    </>
  )
}

export default Test
