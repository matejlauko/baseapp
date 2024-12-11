import { StickyNoteIcon } from 'lucide-react'
import * as React from 'react'
import type { ItemType } from '../item'

interface Props {
  type: ItemType
}

const ItemIcon: React.FC<Props> = ({ type }) => {
  switch (type) {
    case 'task':
      return null
    case 'note':
      return <StickyNoteIcon className="text-neutral-800" size={16} aria-label="Note type" />
    default:
      return null
  }
}

export default ItemIcon
