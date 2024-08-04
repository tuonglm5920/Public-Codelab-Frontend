type Writable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Transform specified readonly properties of an object type into mutable ones.
 * @param {object} sourceObject Source object.
 * @param {string} targetKey Target key will be transformed.
 * @example ```typescript
  type Case1 = ToMutableKeys<{ readonly a: string; b: string }, 'a'>; // { a: string; b: string }
  ```
 */
export type ToMutableKeys<T, K extends keyof T> = Omit<T, K> & Writable<Pick<T, K>>;
