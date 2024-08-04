/**
 * Convert a string type into a union of its individual character types.
 * @param {string} sourceString Source string.
 * @example ```typescript
  type Case1 = StringToUnion<"Hello">; // Result: "H" | "e" | "l" | "l" | "o"
  ```
 */
export type StringToUnion<T extends string> = T extends `${infer Character}${infer Rest}`
  ? Character | StringToUnion<Rest>
  : never;
