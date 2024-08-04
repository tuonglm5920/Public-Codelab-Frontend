import { TrimLeft } from '../../TrimLeft';
import { TrimRight } from '../../TrimRight';

/**
 * Remove whitespace from the start and end of a string type.
 * @param {string} sourceString Source string.
 * @example ```typescript
  type Case1 = Trim<'     unnecessary space will be removed         '>; // 'unnecessary space will be removed'
  ```
 */
export type Trim<V extends string> = TrimLeft<TrimRight<V>>;
