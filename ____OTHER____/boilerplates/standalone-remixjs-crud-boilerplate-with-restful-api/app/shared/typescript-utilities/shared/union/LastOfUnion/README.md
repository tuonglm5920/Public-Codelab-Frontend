# Overview

The `LastOfUnion` type utility is designed to extract the last type from a union.

# Usage

To use the `LastOfUnion` type utility, provide it with a union type. The utility will then evaluate and return the type perceived to be the last in the provided union.

```typescript
type ResultType = LastOfUnion<Union>;
```

# Examples

By applying the `LastOfUnion` type utility, you can extract the perceived last type from this union:

```typescript
type LastType = LastOfUnion<number | string | boolean>; // Result type: boolean
```
