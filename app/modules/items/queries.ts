import { generate } from '@rocicorp/rails'
import type { ReadTransaction } from 'replicache'
import { ITEMS_PREFIX, type Item, type ItemId } from './items'

export const itemQueries = generate<Item>(ITEMS_PREFIX)

/**
 * Get an item by id
 * If id is not provided, return undefined
 */
export const getItem = (id?: ItemId) => (tx: ReadTransaction) =>
  id ? itemQueries.get(tx, id) : Promise.resolve(undefined)

/**
 * List items sorted by updatedAt DESC
 */
export const listItems = async (tx: ReadTransaction) => {
  const items = await itemQueries.list(tx)

  return items.sort((a, b) =>
    (a.updatedAt ?? a.createdAt) < (b.updatedAt ?? b.createdAt) ? 1 : -1
  )
}
