# Overview

The `DeepPartial` type utility is designed to recursively transform all properties of an object, including nested objects, into optional properties.

# Usage

To leverage the `DeepPartial` type utility, provide it with an object type. The utility will then return a new type where every property, including those in nested objects, is optional.

# Examples

By using the `DeepPartial` type utility, you can make all properties optional:

```typescript
type UserProfile = {
  id: number;
  details: {
    name: string;
    age: number;
  };
};
type PartialUserProfile = DeepPartial<UserProfile>;
// Result type:
// {
//     id?: number;
//     details?: {
//         name?: string;
//         age?: number;
//     };
// }
```
