# Overview

The `Checkbox` component extends the functionality of the Ant Design Checkbox component by providing additional customization and support for stricter type safety. It maintains its own state and triggers a callback function when its state changes.

# Props

| Prop          | Type                                         | Default                | Description                                                           |
| ------------- | -------------------------------------------- | ---------------------- | --------------------------------------------------------------------- |
| children      | `ReactNode`                                  | -                      | Content to be displayed next to the checkbox.                         |
| className     | `string`                                     | -                      | Custom CSS class for styling the checkbox.                            |
| checked       | `boolean`                                    | -                      | Whether the checkbox is checked.                                      |
| disabled      | `boolean`                                    | -                      | Whether the checkbox is disabled.                                     |
| indeterminate | `boolean`                                    | -                      | Whether the checkbox is indeterminate.                                |
| onChange      | `(value: boolean) => void`                   | -                      | Callback function triggered when the checkbox state changes.          |
| readOnly      | `boolean`                                    | `false`                | If true, the checkbox is read-only and cannot be changed by the user. |
| valueVariant  | `'controlled-state' \| 'uncontrolled-state'` | `'uncontrolled-state'` | Determines if the checkbox is controlled or uncontrolled state.       |

# Usage

```jsx
import { Checkbox } from "path-to-Checkbox";

// Example usage
<Checkbox className="custom-checkbox" checked={true} disabled={false} indeterminate={false} onChange={(value) => console.log(value)} />;
```
