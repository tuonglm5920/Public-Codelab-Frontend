// https://dev.to/macsikora/advanced-typescript-exercises-answer-1-59ge

type Transform<A> = A extends Promise<infer Inner> ? Inner : never;

/**
 * Extracts the generic type from a type with a single generic parameter.
 * @param {any} generic Generic need extract.
 * @example ```typescript
  type MyGeneric<T> = T;
  type MyType = MyGeneric<'GENERIC'>;
  type _Case1 = GetGeneric<MyType>; // "GENERIC"
  ```
 */
export type GetGeneric<T> = Transform<Promise<T>>;
