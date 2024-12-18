export type NotMaybe<T> = T extends null | undefined ? never : T

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export const skipMaybe = <T>(val: T): val is NotMaybe<T> => val !== null && val !== undefined

export function shallowEqual(a: unknown, b: unknown) {
  if (a === b) return true
  if (!(a instanceof Object) || !(b instanceof Object)) return false

  const keys = Object.keys(a)
  const length = keys.length

  for (let i = 0; i < length; i++) if (!(keys[i] in b)) return false

  for (let i = 0; i < length; i++)
    // @ts-expect-error ignore right now
    if (a[keys[i]] !== b[keys[i]]) return false

  return length === Object.keys(b).length
}
