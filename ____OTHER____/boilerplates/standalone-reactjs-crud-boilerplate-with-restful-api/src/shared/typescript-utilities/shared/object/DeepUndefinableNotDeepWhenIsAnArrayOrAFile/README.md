# Overview

The `DeepUndefinableNotDeepWhenIsAnArrayOrAFile` type utility is designed to recursively transform all properties of a given type, including nested properties, to be optionally `undefined`. However, it does not apply deep recursion for properties that are arrays or instances of `File`.

# Usage

To use the `DeepUndefinableNotDeepWhenIsAnArrayOrAFile` type utility, provide it with a type. The utility will return a new type where every property, except for arrays and instances of `File`, can also be `undefined`.

```typescript
type ResultType = DeepUndefinableNotDeepWhenIsAnArrayOrAFile<OriginalType>;
```

# Example

Here is an example to illustrate how `DeepUndefinableNotDeepWhenIsAnArrayOrAFile` works:

```typescript
interface Company {
  name: string;
  employees: { name: string }[];
  logo: File;
}

// Applying the DeepUndefinableNotDeepWhenIsAnArrayOrAFile utility
type DeepUndefinableCompany = DeepUndefinableNotDeepWhenIsAnArrayOrAFile<Company>;

// Result type:
// {
//   name: string | undefined;
//   employees: { name: string }[] | undefined;
//   logo: File | undefined;
// }
```
