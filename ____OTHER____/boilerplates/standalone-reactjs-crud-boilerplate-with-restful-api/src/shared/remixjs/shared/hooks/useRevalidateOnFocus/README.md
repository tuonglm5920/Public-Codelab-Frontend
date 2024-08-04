# Overview

Custom React hook for Remix Run to revalidate data when the window gains focus or visibility changes.

# Options

| Option  | Type      | Description                                                                                   |
| ------- | --------- | --------------------------------------------------------------------------------------------- |
| enabled | `boolean` | If true, enables the revalidation on window focus and visibility change. Defaults to `false`. |

# Usage

```typescript
import { useRevalidateOnFocus } from './useRevalidateOnFocus';

export function MyComponent() {
  useRevalidateOnFocus();

  return (
    <div>
      <h1>My Component</h1>
      <p>This component will revalidate data when the window gains focus or visibility changes.</p>
    </div>
  );
}
```
