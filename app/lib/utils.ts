export type NotMaybe<T> = T extends null | undefined ? never : T

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export const skipMaybe = <T>(val: T): val is NotMaybe<T> => val !== null && val !== undefined
