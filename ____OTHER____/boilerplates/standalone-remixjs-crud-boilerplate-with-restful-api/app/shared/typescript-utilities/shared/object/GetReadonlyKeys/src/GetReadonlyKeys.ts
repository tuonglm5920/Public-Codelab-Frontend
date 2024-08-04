import { DeepMutable } from '../../DeepMutable';

type IsFullyWritable<T extends object> = IsEqualConsideringWritability<
  { [Q in keyof T]: T[Q] },
  DeepMutable<{ [Q in keyof T]: T[Q] }>
>;
type IsEqualConsideringWritability<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * Extracts the keys from an object type that are marked as readonly.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type Case1 = GetReadonlyKeys<{ readonly a: number; b: string; }>; // a
  type Case2 = GetReadonlyKeys<{ readonly a: number; readonly b?: string; }>; //  "a" | "b"
  ```
 */
export type GetReadonlyKeys<T extends object> = {
  [P in keyof T]-?: IsFullyWritable<Pick<T, P>> extends true ? never : P;
}[keyof T];
