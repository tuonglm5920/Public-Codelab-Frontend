/**
 * Convert specified required properties of an object type into optional ones.
 * @param {object} sourceObject Source object.
 * @param {string} targetKey Target key will be transformed.
 * @example ```typescript
  type Case1 = ToOptionalKeys<{ a: string }, 'a'>; // { a?: string }
  ```
 */
export type ToOptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
