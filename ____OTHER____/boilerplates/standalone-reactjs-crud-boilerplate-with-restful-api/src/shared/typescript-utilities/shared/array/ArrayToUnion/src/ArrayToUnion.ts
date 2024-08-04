/**
 * Transforms a array type into its corresponding union type.
 * @param {any[]} list Source array of specific literals.
 * @example ```typescript
  type Case1 = ArrayToUnion<[0, 'data', 1, 'abc']>;
  // Result: 0 | "data" | 1 | 'abc'
  ```
 */
export type ArrayToUnion<T> = T extends (infer U)[] ? U : never;
// export type ArrayToUnion<T extends any[]> = T[number];
