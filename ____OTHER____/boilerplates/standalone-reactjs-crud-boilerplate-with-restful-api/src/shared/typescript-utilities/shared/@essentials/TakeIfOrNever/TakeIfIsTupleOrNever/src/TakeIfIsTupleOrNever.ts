/**
 * Evaluates a given type and returns the type if it's a tuple, or the `never` type otherwise.
 * @param {any} sourceType Source type.
 * @example ```typescript
  type SomeTuple = [string, number];
  type SomeArray = string[];
  type TupleResult = TakeIfIsTupleOrNever<SomeTuple>;  // Result type: [string, number]
  type ArrayResult = TakeIfIsTupleOrNever<SomeArray>;  // Result type: never
  ```
 */
export type TakeIfIsTupleOrNever<T> = T extends any[] ? (any[] extends T ? never : T) : never;
