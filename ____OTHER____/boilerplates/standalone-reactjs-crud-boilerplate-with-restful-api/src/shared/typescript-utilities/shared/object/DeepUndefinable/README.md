# Overview

The `DeepUndefinable` type utility is designed to recursively transform all properties of a given type, including nested properties, to be optionally `undefined`. This is particularly useful when you need to create a version of a type where every property, including those in nested objects or arrays, can be `undefined`.

# Usage

To use the `DeepUndefinable` type utility, provide it with a type. The utility will return a new type where every property, including those in nested objects or arrays, can also be `undefined`.

```typescript
type ResultType = DeepUndefinable<OriginalType>;
```

# Example

Here is an example to illustrate how `DeepUndefinable` works:

```typescript
interface Company {
  name: string;
  employees: { name: string }[];
}

// Applying the DeepUndefinable utility
type DeepUndefinableCompany = DeepUndefinable<Company>;

// Result type:
// {
//   name: string | undefined;
//   employees: { name: string | undefined }[] | undefined;
// }
```
