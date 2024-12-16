import type { DB } from '@/lib/db/db'
import { getLogger } from '@/lib/logger'
import { generate } from '@rocicorp/rails'
import {
  createItemSchema,
  updateItemSchema,
  type CreateItem,
  type UpdateItem,
} from '../../../database/schema'
import {
  ITEMS_PREFIX,
  type CreateItemData,
  type Item,
  type ItemId,
  type UpdateItemData,
} from './items'

const { captureError } = getLogger('items')

const generatedMutators = generate<Item>(ITEMS_PREFIX)

export const itemMutators = {
  setItem: generatedMutators.set,
  updateItem: generatedMutators.update,
  deleteItem: generatedMutators.delete,
}

export const createItemMutation =
  (db: DB) =>
  async (data: CreateItemData): Promise<CreateItem | false> => {
    const _data = { ...data } as CreateItem

    _data.id = crypto.randomUUID()
    _data.createdAt = new Date().toISOString()
    _data.updatedAt = new Date().toISOString()
    _data.tags = data.tags ?? []

    try {
      await db.mutate.setItem(createItemSchema.parse(_data) as Item)

      return _data
    } catch (error) {
      captureError(error)

      return false
    }
  }

export const updateItemMutation =
  (db: DB) =>
  async (data: Omit<UpdateItemData, 'id'> & { id: ItemId }): Promise<UpdateItem | false> => {
    try {
      const _data = { ...data } as UpdateItem

      _data.updatedAt = new Date().toISOString()

      await db.mutate.updateItem(updateItemSchema.parse(_data))

      return _data
    } catch (error) {
      captureError(error)

      return false
    }
  }

export const deleteItemMutation = (db: DB) => async (id: ItemId) => {
  await db.mutate.deleteItem(id)

  return id
}
