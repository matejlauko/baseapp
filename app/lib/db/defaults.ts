import type { Item } from '@/modules/items/item'

export const DEFAULT_ITEMS = [
  {
    id: crypto.randomUUID(),
    title: 'Idea 1',
    text: 'This is the first idea',
    type: 'note',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tags: [],
    completed: null,
  },
] as const satisfies Item[]
