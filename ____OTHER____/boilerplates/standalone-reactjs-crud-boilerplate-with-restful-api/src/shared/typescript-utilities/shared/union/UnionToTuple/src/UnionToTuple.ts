// TS4.1
// https://github.com/microsoft/TypeScript/issues/13298
import { UnionToIntersection } from '../../UnionToIntersection';

/**
 * Convert a union type into its tuple representation
 * @param {union} union Source union.
 * @example ```typescript
  type Case1 = UnionToTuple<"a" | "b" | "c" | "d" >; // Result:  ["a", "b", "c", "d"]
  ```
 */
export type UnionToTuple<T> =
  UnionToIntersection<T extends any ? (t: T) => T : never> extends (_: any) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];
