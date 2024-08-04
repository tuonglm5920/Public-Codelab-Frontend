# Overview

The Popover component extends the functionality of the Ant Design Popover component by providing additional customization and support for stricter type safety.

# Props

| Prop             | Type             | Default | Description                                                                |
| ---------------- | ---------------- | ------- | -------------------------------------------------------------------------- |
| className        | string           | -       | Custom CSS class for styling the popover.                                  |
| arrow            | boolean          | true    | Whether to display an arrow pointing to the reference element.             |
| children         | ReactNode        | -       | The trigger of the popover.                                                |
| color            | string           | -       | The color of the popover.                                                  |
| content          | string/ReactNode | -       | The content of the popover.                                                |
| trigger          | string           | -       | The trigger mode which can be 'hover', 'focus', 'click', or 'contextMenu'. |
| overlayClassName | string           | -       | Custom CSS class for the overlay.                                          |
| disabled         | boolean          | false   | Whether the popover is disabled.                                           |

# Usage

```jsx
import { Popover } from "path/to/Popover";

// Example usage
<Popover content="Popover text" disabled={false}>
  <span>Hover over me</span>
</Popover>;
```
