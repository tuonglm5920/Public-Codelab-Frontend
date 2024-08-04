/**
 * Recursively transform all properties of an object, including nested objects, from `readonly` to mutable.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type ImmutableUserProfile = {
    readonly id: number;
    readonly details: {
      readonly name: string;
      readonly age: number;
    };
  };
  type MutableUserProfile = DeepMutable<ImmutableUserProfile>;
  // Result type:
  // {
  //   id: number;
  //   details: {
  //     name: string;
  //     age: number;
  //   };
  // }
  ```
 */
export type DeepMutable<T> = {
  -readonly [P in keyof T]: DeepMutable<T[P]>;
};
