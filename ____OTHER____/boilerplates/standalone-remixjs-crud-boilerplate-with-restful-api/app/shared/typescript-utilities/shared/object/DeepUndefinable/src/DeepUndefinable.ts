import { BuiltIn, TakeIfIsTupleOrNever } from '../../../@essentials';

/**
 * `DeepUndefinable<Type>` constructs a type by picking all properties from type Type recursively and include undefined property values for all of them
 * @example ```typescript
  interface Company {
    name: string;
    employees: { name: string }[];
  }

  // Result: { name: string | undefined; employees: { name: string | undefined }[] }
  type DeepUndefinableCompany = DeepUndefinable<Company>;
 ```
 */
export type DeepUndefinable<Type> = Type extends BuiltIn
  ? Type | undefined
  : Type extends Map<infer Keys, infer Values>
    ? Map<DeepUndefinable<Keys>, DeepUndefinable<Values>>
    : Type extends ReadonlyMap<infer Keys, infer Values>
      ? ReadonlyMap<DeepUndefinable<Keys>, DeepUndefinable<Values>>
      : Type extends WeakMap<infer Keys, infer Values>
        ? // TODO: replace it with WeakKey (introduced at TypeScript@5.2)
          // WeakMap key has to satisfy WeakKey which is object at the moment
          DeepUndefinable<Keys> extends object
          ? WeakMap<DeepUndefinable<Keys>, DeepUndefinable<Values>>
          : never
        : Type extends Set<infer Values>
          ? Set<DeepUndefinable<Values>>
          : Type extends ReadonlySet<infer Values>
            ? ReadonlySet<DeepUndefinable<Values>>
            : Type extends WeakSet<infer Values>
              ? // TODO: replace it with WeakKey (introduced at TypeScript@5.2)
                // WeakSet key has to satisfy WeakKey which is object at the moment
                DeepUndefinable<Values> extends object
                ? WeakSet<DeepUndefinable<Values>>
                : never
              : Type extends ReadonlyArray<infer Values>
                ? Type extends TakeIfIsTupleOrNever<Type>
                  ? { [Key in keyof Type]: DeepUndefinable<Type[Key]> | undefined }
                  : Type extends Array<Values>
                    ? Array<DeepUndefinable<Values>>
                    : ReadonlyArray<DeepUndefinable<Values>>
                : Type extends Promise<infer Value>
                  ? Promise<DeepUndefinable<Value>>
                  : Type extends {}
                    ? { [Key in keyof Type]: DeepUndefinable<Type[Key]> }
                    : Type | undefined;
