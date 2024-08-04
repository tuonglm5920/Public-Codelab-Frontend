/**
 * Provides a concise way to obtain the keys of an object type as a union of string literal types.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type _Case1 = KeyOf<{ a: string; b: number }>; // Result: "a" | "b"
  ```
 */
export type KeyOf<T extends object> = keyof T;
