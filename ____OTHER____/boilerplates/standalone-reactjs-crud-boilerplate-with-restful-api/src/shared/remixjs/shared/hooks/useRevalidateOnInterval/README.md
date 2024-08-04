# Overview

Custom React hook for Remix Run to revalidate data at a specified interval.

# Options

| Option   | Type      | Description                                                                      |
| -------- | --------- | -------------------------------------------------------------------------------- |
| enabled  | `boolean` | If true, enables the revalidation at a specified interval. Defaults to `true`.   |
| interval | `number`  | The interval time in milliseconds at which to revalidate. Defaults to `1000` ms. |

# Usage

```typescript
import { useRevalidateOnInterval } from './useRevalidateOnInterval';

export function MyComponent() {
  useRevalidateOnInterval({ enabled: true, interval: 5000 });

  return (
    <div>
      <h1>My Component</h1>
      <p>This component will revalidate data every 5 seconds.</p>
    </div>
  );
}
```
