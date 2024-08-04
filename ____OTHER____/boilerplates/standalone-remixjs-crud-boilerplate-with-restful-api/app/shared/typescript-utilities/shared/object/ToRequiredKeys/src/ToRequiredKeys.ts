/**
 * Transform an optional key in an object type into a required key.
 * @param {object} sourceObject Source object.
 * @param {union} keys The key (or keys) from the object type that you wish to convert from optional to required.
 * @example ```typescript
  type Case1 = ToRequiredKeys<{ a?: string; b: number }, 'a'>; // { a: string, b: number }
  ```
 */
export type ToRequiredKeys<T, RK extends keyof T> = Omit<T, RK> & Required<Pick<T, RK>>;
