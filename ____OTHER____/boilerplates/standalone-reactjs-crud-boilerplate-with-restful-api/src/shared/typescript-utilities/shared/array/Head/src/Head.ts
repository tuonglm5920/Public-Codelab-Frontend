// export type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;
/**
 * Extract the first element type from a tuple.
 * @param {any[]} list Source array.
 * @example ```typescript
  type Case1 = Head<[1, 2, string, boolean]>; // Result: 1
  ```
 */
export type Head<T> = T extends [infer I, ...infer _Rest] ? I : never;
