import { UnionToIntersection } from '../../UnionToIntersection';

/**
 * Extract the last type from a union.
 * @param {union} union Source union.
 * @example ```typescript
  type Case1 = LastOfUnion<'A' | 'B' | 'C'>; // Result type: 'C'
  ```
  */
export type LastOfUnion<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;
