# Overview

The `DeepReadonly` type utility is designed to recursively transform all properties of an object, including nested objects, into `readonly` properties.

# Usage

To harness the `DeepReadonly` type utility, provide it with an object type that has mutable properties. The utility will then return a new type where every property, including those in nested objects, is `readonly`.

```typescript
type ResultType = DeepReadonly<MutableType>;
```

# Examples

Consider an object type with nested mutable properties:

```typescript
type MutableUserProfile = {
  id: number;
  details: {
    name: string;
    age: number;
  };
};
type ReadonlyUserProfile = DeepReadonly<MutableUserProfile>;
// Result type:
// {
//     readonly id: number;
//     readonly details: {
//         readonly name: string;
//         readonly age: number;
//     };
// }
```
