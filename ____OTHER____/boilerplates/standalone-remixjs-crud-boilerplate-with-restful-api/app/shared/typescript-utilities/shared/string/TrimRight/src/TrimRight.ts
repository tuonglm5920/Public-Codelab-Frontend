/**
 * Eliminate whitespace from the end of a string type.
 * @param {string} sourceString Source string.
 * @example ```typescript
  type Case1 = TrimRight<'Space at right will be removed           '>; // 'Space at right will be removed
  ```
 */
export type TrimRight<V extends string> = V extends `${infer R} ` ? TrimRight<R> : V;
