/**
 * Transforms a union type into its intersection equivalent.
 * @param {union} union Source union.
 * @example ```typescript
  type Case1 = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
  ```
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
