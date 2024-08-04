/**
 * Transform specified mutable properties of an object type into readonly ones.
 * @param {object} sourceObject Source object.
 * @param {string} targetKey Target key will be transformed.
 * @example ```typescript
  type Case1 = ToReadonlyKeys<{ a: string; b: string }, 'a'>; // { readonly a: string; b: string }
  ```
 */
export type ToReadonlyKeys<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
