/**
 * Appending an additional argument to its parameter list.
 * @param {Function} sourceFunction Source function.
 * @param {any} argType ArgType will be appended to source function.
 * @example ```typescript
  type InitialFunction = (x: number, y: number) => void;
  type ExtendedFunction = AppendArgument<InitialFunction, string>;
  // Result type:
  // (x: number, y: number, z: string) => void
  ```
 */
export type AppendArgument<Fn, ArgType> = Fn extends (...args: infer T) => infer R
  ? (...args: [...T, ArgType]) => R
  : never;
