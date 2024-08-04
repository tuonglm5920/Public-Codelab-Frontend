# Overview

The Tooltip component extends the functionality of the Ant Design Tooltip component by providing additional customization and support for stricter type safety.

# Props

| Prop             | Type             | Default | Description                                                                |
| ---------------- | ---------------- | ------- | -------------------------------------------------------------------------- |
| className        | string           | -       | Custom CSS class for styling the tooltip.                                  |
| arrow            | boolean          | true    | Whether to display an arrow pointing to the reference element.             |
| children         | ReactNode        | -       | The trigger of the tooltip.                                                |
| color            | string           | -       | The color of the tooltip.                                                  |
| content          | string/ReactNode | -       | The content of the tooltip.                                                |
| trigger          | string           | -       | The trigger mode which can be 'hover', 'focus', 'click', or 'contextMenu'. |
| overlayClassName | string           | -       | Custom CSS class for the overlay.                                          |
| disabled         | boolean          | false   | Whether the tooltip is disabled.                                           |

# Usage

```jsx
import { Tooltip } from "path/to/Tooltip";

// Example usage
<Tooltip content="Tooltip text" disabled={false}>
  <span>Hover over me</span>
</Tooltip>;
```
