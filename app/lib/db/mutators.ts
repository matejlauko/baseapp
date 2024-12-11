import { itemMutators } from '../../modules/items/mutators'

export type M = typeof mutators

export const mutators = {
  ...itemMutators,
}
