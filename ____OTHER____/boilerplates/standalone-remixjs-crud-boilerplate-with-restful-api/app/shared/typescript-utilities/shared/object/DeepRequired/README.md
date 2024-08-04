# Overview

The `DeepRequired` type utility is designed to recursively transform all properties of an object, including nested objects, into required properties.

# Usage

To harness the `DeepRequired` type utility, provide it with an object type that has optional properties. The utility will then return a new type where every property, including those in nested objects, is required.

```typescript
type ResultType = DeepRequired<PartialType>;
```

# Examples

By employing the `DeepRequired` type utility, you can make all properties required:

```typescript
type PartialUserProfile = {
  id?: number;
  details?: {
    name?: string;
    age?: number;
  };
};
type RequiredUserProfile = DeepRequired<PartialUserProfile>;
// Result type:
// {
//     id: number;
//     details: {
//         name: string;
//         age: number;
//     };
// }
```
