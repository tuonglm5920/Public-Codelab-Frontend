/**
 * Remove whitespace from the start of a string type.
 * @param {string} sourceString Source string.
 * @example ```typescript
  type Case1 = TrimLeft<'      Space in left will be removed'>; // 'Space in left will be removed'
  ```
 */
export type TrimLeft<V extends string> = V extends ` ${infer R}` ? TrimLeft<R> : V;
