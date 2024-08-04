/**
 * Determine the number of elements in a tuple type.
 * @param {any[]} list Source array.
 * @example ```typescript
  type Case1 = Length<[1, 2, 3]> // 3
  ```
 */
export type Length<T extends any[]> = T['length'];
