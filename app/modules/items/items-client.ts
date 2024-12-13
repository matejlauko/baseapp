import { getLogger } from '@os/logger'

import type { DB } from '../../libs/db'
import type { ItemData, Items } from './items'
import { ItemType, ItemTypes } from './items'
import { listItems } from './queries'
import { itemsStore } from './store'

type ParsedItemData = Pick<ItemData, 'title' | 'tags'> & Partial<Pick<ItemData, 'type'>>

const { log } = getLogger('items-client')

export function parseItemVal(val: string): ParsedItemData {
  log('parseItemVal', { val })

  val = val.trim()

  const itemData: ParsedItemData = {
    title: '',
    tags: [],
    type: undefined, // Default type
  }

  if (!val) return itemData

  // Check for item type at the start
  const typeMatch = val.match(new RegExp(`^(${ItemTypes.join('|')}):\\s*`, 'i'))
  if (typeMatch) {
    itemData.type = typeMatch[1].toLowerCase() as ItemType
    val = val.slice(typeMatch[0].length) // Remove type from the content
  }

  let currType: 'content' | 'tag' = 'content'
  let token = ''

  // log(`-- ${val} --`);

  for (let i = 0; i <= val.length; i++) {
    const ch = val[i]

    if (!ch) {
      // log(`end:[${token}]`);

      if (currType === 'tag') {
        itemData.tags.push(token)
      } else {
        itemData.title += token
      }

      break
    }

    if (ch.match(/\s/)) {
      // log(`${currType}:[${token}+${ch}]`);

      if (currType === 'tag') {
        if (!token) continue

        itemData.tags.push(token)

        currType = 'content'
      } else {
        itemData.title += token + ch
      }

      token = ''
      continue
    }

    if (ch.match(/#/)) {
      currType = 'tag'
      continue
    }

    if (ch.match(/:/)) {
      if (currType === 'content') {
        if (token === 'tag') {
          currType = 'tag'
          token = ''
          continue
        }
      }
    }

    // log(`[${token}+${ch}]`);
    token += ch
  }

  itemData.title = itemData.title.trimEnd()

  return itemData
}

export function getAllTagsFromItems(items: Items): string[] {
  return items.map((item) => item.tags).flat()
}

export async function prepareItems(db: DB) {
  db.subscribe(listItems, (items) => {
    itemsStore.allTags = getAllTagsFromItems(items)
  })
}
