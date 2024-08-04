# Overview

The `DeepNullable` type utility is tailored to recursively transform all properties of an object, including nested objects, into nullable properties.

# Usage

To employ the `DeepNullable` type utility, provide it with an object type. The utility will then return a new type where every property, including those in nested objects, can be `null` or `undefined`.

```typescript
type ResultType = DeepNullable<OriginalType>;
```

# Examples

Consider an object type with nested properties:

```typescript
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
//     id?: number | null;
//     details?: {
//         name?: string | null;
//         age?: number | null;
//     } | null;
// }
```
