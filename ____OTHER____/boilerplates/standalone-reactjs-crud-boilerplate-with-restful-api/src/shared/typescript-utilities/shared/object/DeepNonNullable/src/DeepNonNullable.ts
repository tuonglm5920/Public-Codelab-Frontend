import { BuiltIn } from '../../../@essentials';

/**
 * Recursively transform all properties of an object, including nested objects, from nullable (`null` or `undefined`) to non-nullable.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  type NullableUserProfile = {
    id: number | null;
    details?: {
      name: string | undefined;
      age?: number;
    };
  };
  type NonNullableUserProfile = DeepNonNullable<NullableUserProfile>;
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
export type DeepNonNullable<T> = T extends BuiltIn
  ? NonNullable<T>
  : T extends Map<infer K, infer V>
    ? Map<DeepNonNullable<K>, DeepNonNullable<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepNonNullable<K>, DeepNonNullable<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<DeepNonNullable<K>, DeepNonNullable<V>>
        : T extends Set<infer U>
          ? Set<DeepNonNullable<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<DeepNonNullable<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<DeepNonNullable<U>>
              : T extends Promise<infer U>
                ? Promise<DeepNonNullable<U>>
                : T extends {}
                  ? { [K in keyof T]: DeepNonNullable<T[K]> }
                  : NonNullable<T>;
