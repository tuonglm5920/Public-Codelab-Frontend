import { Recurse } from '../../../@essentials';
import { Push } from '../../../array';

// https://github.com/microsoft/TypeScript/pull/40336
type _Split<
  SourceString extends string,
  Separator extends string,
  Result extends any[] = [],
> = SourceString extends `${infer T}${Separator}${infer U}`
  ? { __rec: _Split<U, Separator, Push<Result, T>> }
  : Push<Result, SourceString>;

/**
 * Divide a string type into a tuple of substrings based on a specified delimiter.
 * @param {string} sourceString Source string.
 * @param {string} separator Separator split string to array.
 * @example ```typescript
  const string = `Lorem Ipsum`;
  type _Case1 = Split<typeof string, ' '>; // Result: ["Lorem", "Ipsum"]
  ```
 */
export type Split<S extends string, D extends string> = Recurse<_Split<S, D>>;
