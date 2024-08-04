/**
 * Merges two object types, with the second object (B) taking precedence over the first object (A) for overlapping properties.
 * @param {object} firstObject First object.
 * @param {object} secondObject Second object.
 * @example ```typescript
  interface A {
    x: string;
    y: number;
  }
  interface B {
    x: boolean;
    z: string;
  }
  type MergedType = MergeObjectB2A<A, B>;
  // Result type:
  // {
  //     x: boolean;
  //     y: number;
  //     z: string;
  // }
  ```
 */
export type MergeObjectB2A<A extends object, B extends object> = Omit<A, keyof B> & B;
