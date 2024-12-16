import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/ui/select'
import { DEFAULT_ITEM_TYPE, ItemType } from '@/modules/items/items'
import * as React from 'react'

interface Props {
  currentType: ItemType | undefined
  onChange: (type: ItemType) => void
  onClose: () => void
}

const ItemTypeSelect: React.FC<Props> = ({
  currentType = DEFAULT_ITEM_TYPE,
  onChange,
  onClose,
}) => {
  return (
    <Select value={currentType} onValueChange={onChange}>
      <SelectTrigger className="h-6 w-[72px] px-2 py-1 text-xs">
        <SelectValue placeholder="Type" />
      </SelectTrigger>

      <SelectContent onCloseAutoFocus={() => onClose()}>
        {Object.entries(ItemType).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ItemTypeSelect
