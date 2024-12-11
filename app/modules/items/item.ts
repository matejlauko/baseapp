import {
  itemTypeEnum,
  type CreateItem,
  type Item as SchemaItem,
  type UpdateItem,
} from '../../../database/schema'

export type Item = Omit<SchemaItem, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
export type ItemId = Item['id']

export const ItemTypeList = itemTypeEnum.enumValues
export type ItemType = (typeof ItemTypeList)[number]
export const ItemType = {
  Task: 'task',
  Note: 'note',
} as const satisfies Record<string, ItemType>

export const DEFAULT_ITEM_TYPE = ItemType.Note

export type CreateItemData = Pick<CreateItem, 'text' | 'type' | 'tags'> &
  Partial<Pick<SchemaItem, 'completed'>>
export type UpdateItemData = Pick<UpdateItem, 'id' | 'text' | 'type' | 'completed'>

export { ITEMS_PREFIX } from '../../../database/shared'
