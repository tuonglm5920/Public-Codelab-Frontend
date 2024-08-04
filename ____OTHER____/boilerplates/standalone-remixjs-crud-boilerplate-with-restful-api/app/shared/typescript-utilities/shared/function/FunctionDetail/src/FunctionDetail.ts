// export type FunctionDetail<F extends Function> = F extends (...args: infer Params) => infer ReturnType
//   ? [Params, ReturnType]
//   : never;

/**
 * Deconstruct a function type into its individual components, such as its parameters and return type.
 * @param {Function} sourceFunction Source function
 * @example ```typescript
  type FunctionComponents = FunctionDetail<ExampleFunction>;
  // Result type:
  // {
  //   parameters: [number, string];
  //   returnType: boolean;
  // }
  ```
 */
export type FunctionDetail<F extends Function> = F extends (...args: infer A) => infer R
  ? { params: A; returnType: R }
  : never;
