# Overview

The `DeepNonNullable` type utility is crafted to recursively transform all properties of an object, including nested objects, from nullable (`null` or `undefined`) to non-nullable.

# Usage

To utilize the `DeepNonNullable` type utility, provide it with an object type that might have nullable properties. The utility will then return a new type where every property, including those in nested objects, is non-nullable.

```typescript
type ResultType = DeepNonNullable<NullableType>;
```

# Examples

Consider an object type with nested nullable properties:

```typescript
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
//     id: number;
//     details: {
//         name: string;
//         age: number;
//     };
// }
```
