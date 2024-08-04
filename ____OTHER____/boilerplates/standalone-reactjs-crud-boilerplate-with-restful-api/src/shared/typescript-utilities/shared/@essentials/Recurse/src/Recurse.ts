type _Recurse<T> = T extends { __rec: never }
  ? never
  : T extends { __rec: { __rec: infer U } }
    ? { __rec: _Recurse<U> }
    : T extends { __rec: infer U }
      ? U
      : T;

/**
 * Cheat for error "Type instantiation is excessively deep or possibly infinite."
 * @example ```typescript
  type _Split<S extends string, D extends string, A extends any[] = []> = S extends `${infer T}${D}${infer U}`
  ? { __rec: _Split<U, D, Push<A, T>> }
  : A;
  type Split<S extends string, D extends string> = Recurse<_Split<S, D>>;
  type Case1 = Split<"very long string ...", ' '> ==> OK

  type Split<S extends string, D extends string, A extends any[] = []> = S extends `${infer T}${D}${infer U}`
    ? { __rec: Split<U, D, Push<A, T>> }
    : A;
  type Case2 = Split<"very long string ...", ' '> ==> Error "Type instantiation is excessively deep or possibly infinite."
  ```
 */
export type Recurse<T> = T extends { __rec: unknown } ? Recurse<_Recurse<T>> : T;

type Repeat<T, N extends number> = Recurse<_Repeat<T, N, []>>;
type _Repeat<T, N extends number, A extends T[]> = A['length'] extends N ? A : { __rec: _Repeat<T, N, [T, ...A]> };

// XS = ["x", ..., "x"] and XS["length"] = 100
type _XS = Repeat<'x', 100>;

//https://dev.to/susisu/how-to-create-deep-recursive-types-5fgg#:~:text=As%20of%20TypeScript%204.1%2C%20the,think%20this%20is%20too%20strict
