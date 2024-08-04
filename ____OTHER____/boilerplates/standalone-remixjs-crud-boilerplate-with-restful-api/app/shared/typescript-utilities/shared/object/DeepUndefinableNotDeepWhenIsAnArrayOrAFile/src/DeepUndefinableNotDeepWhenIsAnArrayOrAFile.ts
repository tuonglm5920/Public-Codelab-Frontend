import { BuiltIn } from '../../../@essentials';

/**
 * `DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Type>` constructs a type by picking all properties from type Type recursively and include `undefined` property values for all of them.
 * However, it does not apply deep recursion for properties that are arrays or instances of `File`.
 *
 * @example
 * ```typescript
 * interface Company {
 *   name: string;
 *   employees: { name: string }[];
 *   logo: File;
 * }
 *
 * // Result: { name: string | undefined; employees: { name: string }[] | undefined; logo: File | undefined }
 * type DeepUndefinableCompany = DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Company>;
 * ```
 */
export type DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Type> = Type extends BuiltIn
  ? Type | undefined
  : Type extends Map<infer Keys, infer Values>
    ? Map<DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Keys>, DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Values>>
    : Type extends ReadonlyMap<infer Keys, infer Values>
      ? ReadonlyMap<
          DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Keys>,
          DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Values>
        >
      : Type extends WeakMap<infer Keys, infer Values>
        ? // TODO: replace it with WeakKey (introduced at TypeScript@5.2)
          // WeakMap key has to satisfy WeakKey which is object at the moment
          DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Keys> extends object
          ? WeakMap<
              DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Keys>,
              DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Values>
            >
          : never
        : Type extends Set<infer Values>
          ? Set<DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Values>>
          : Type extends ReadonlySet<infer Values>
            ? ReadonlySet<DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Values>>
            : Type extends WeakSet<infer Values>
              ? // TODO: replace it with WeakKey (introduced at TypeScript@5.2)
                // WeakSet key has to satisfy WeakKey which is object at the moment
                DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Values> extends object
                ? WeakSet<DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Values>>
                : never
              : Type extends ReadonlyArray<infer _Values>
                ? Type | undefined
                : Type extends Array<infer _Values>
                  ? Type | undefined
                  : Type extends Promise<infer Value>
                    ? Promise<DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Value>>
                    : Type extends File
                      ? Type | undefined
                      : Type extends {}
                        ? { [Key in keyof Type]: DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Type[Key]> }
                        : Type | undefined;
