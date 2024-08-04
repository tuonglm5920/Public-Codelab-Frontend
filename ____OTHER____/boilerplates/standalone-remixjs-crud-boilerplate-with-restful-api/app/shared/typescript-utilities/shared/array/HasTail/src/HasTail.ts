/**
 * Determine whether a given tuple type has tail elements, i.e., elements following the first element.
 * @param {any[]} list Source array.
 * @example ```typescript
  type Case1 = HasTail<[]>; // Result: false
  type Case2 = HasTail<[1]>; // Result: false
  type Case3 = HasTail<[1, 2, 3]>; // Result: true
 ```
 */
export type HasTail<T extends any[]> = T extends [] | [any] ? false : true;
