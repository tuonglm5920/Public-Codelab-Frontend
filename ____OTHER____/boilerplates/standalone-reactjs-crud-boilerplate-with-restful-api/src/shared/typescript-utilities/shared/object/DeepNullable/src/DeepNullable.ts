import { BuiltIn, TakeIfIsTupleOrNever } from '../../../@essentials';

/**
 * Recursively transform all properties of an object, including nested objects, into nullable properties.
 * @param {object} sourceObject Source object.
 * @example ```typescript
type UserProfile = {
  id: number;
  details: {
    name: string;
    age: number;
  };
};
type NullableUserProfile = DeepNullable<UserProfile>;
// Result type:
// {
//   id?: number | null;
//   details?: {
//     name?: string | null;
//     age?: number | null;
//   } | null;
// }
  ```
 */

export type DeepNullable<Type> = Type extends BuiltIn
  ? Type | null
  : Type extends Map<infer Keys, infer Values>
    ? Map<DeepNullable<Keys>, DeepNullable<Values>>
    : Type extends ReadonlyMap<infer Keys, infer Values>
      ? ReadonlyMap<DeepNullable<Keys>, DeepNullable<Values>>
      : Type extends WeakMap<infer Keys, infer Values>
        ? // @ts-ignore
          WeakMap<DeepNullable<Keys>, DeepNullable<Values>>
        : Type extends Set<infer Values>
          ? Set<DeepNullable<Values>>
          : Type extends ReadonlySet<infer Values>
            ? ReadonlySet<DeepNullable<Values>>
            : Type extends WeakSet<infer Values>
              ? // @ts-ignore
                WeakSet<DeepNullable<Values>>
              : Type extends ReadonlyArray<infer Values>
                ? Type extends TakeIfIsTupleOrNever<Type>
                  ? { [Key in keyof Type]: DeepNullable<Type[Key]> | null }
                  : Type extends Array<Values>
                    ? Array<DeepNullable<Values>>
                    : ReadonlyArray<DeepNullable<Values>>
                : Type extends Promise<infer Value>
                  ? Promise<DeepNullable<Value>>
                  : Type extends {}
                    ? { [Key in keyof Type]: DeepNullable<Type[Key]> }
                    : Type | null;
