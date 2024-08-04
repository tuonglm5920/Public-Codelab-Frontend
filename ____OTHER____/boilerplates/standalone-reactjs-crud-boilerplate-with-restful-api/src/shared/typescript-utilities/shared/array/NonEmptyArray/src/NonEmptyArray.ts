/**
 * Ensures that a given array type always contains at least one element.
 * @param {any[]} itemType type of array's item.
 * @example ```typescript
  const case1: NonEmptyArray<number> = [1, 2]; // This is valid.
  const case2: NonEmptyArray<number> = [1];    // This is also valid.
  const case3: NonEmptyArray<number> = [];     // Type error! Array must contain at least one element.
 ```
 */
export type NonEmptyArray<T> = [T, ...T[]];
