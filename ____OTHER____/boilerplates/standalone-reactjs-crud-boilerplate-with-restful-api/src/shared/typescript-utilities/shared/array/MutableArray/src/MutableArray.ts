/**
 * Convert read-only arrays (`readonly T[]`) to mutable ones.
 * @param {any[]} list Source array.
 * @example ```typescript
  type Case1: MutableArray<readonly [1, 2, 3, 4]> = [1, 2, 3, 4]; // Result: [1, 2, 3, 4]
  ```
 */
export type MutableArray<T> = {
  -readonly [K in keyof T]: T[K];
};
