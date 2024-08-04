import { CheckElementExistInArray } from '../../CheckElementExistInArray';

/**
 * Utility function is designed to identify and retrieve duplicate items within an array.
 * @param {any[]} list Source array.
 * @example ```typescript
  const data = [[1, 2], [1, 2], 2, 3, 4] as const;
  type Case1 = FindDuplicateElementInArray<MutableArray<typeof data>>; // Result: ["Encountered value with duplicates:", [1, 2]]
  type Case2 = FindDuplicateElementInArray<MutableArray<['Lorem', 'ipsum', 'dolor', 4, 'Lorem']>>; // Result: ["Encountered value with duplicates:", "Lorem"]
  ```
 */
export type FindDuplicateElementInArray<T> = T extends readonly [infer X, ...infer Rest]
  ? CheckElementExistInArray<Rest, X> extends true
    ? ['Encountered value with duplicates:', X]
    : readonly [X, ...FindDuplicateElementInArray<Rest>]
  : T;
