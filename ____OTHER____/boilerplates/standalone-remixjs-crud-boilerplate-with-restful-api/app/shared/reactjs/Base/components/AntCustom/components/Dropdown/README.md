# Overview

The Dropdown component extends the functionality of the Ant Design Dropdown component by providing additional customization and support for stricter type safety.

# Props

| Prop       | Type      | Default | Description                                               |
| ---------- | --------- | ------- | --------------------------------------------------------- |
| children   | ReactNode | -       | The trigger element for the dropdown.                     |
| className  | string    | -       | Custom CSS class for styling the dropdown.                |
| items      | Item[]    | -       | The menu items to be displayed.                           |
| expandIcon | ReactNode | -       | The icon for expanding the menu items.                    |
| footer     | ReactNode | -       | The footer to be displayed at the bottom of the dropdown. |
| arrow      | boolean   | true    | Whether to show the arrow on the dropdown.                |
| trigger    | string[]  | -       | The trigger mode of the dropdown.                         |

# Usage

```jsx
import { Dropdown } from "path/to/Dropdown";

// Example usage
const items = [
  {
    key: "1",
    label: "Item 1",
    icon: <ItemIcon />,
    children: [
      {
        key: "1-1",
        label: "Sub Item 1-1",
      },
      {
        key: "1-2",
        label: "Sub Item 1-2",
      },
    ],
  },
  {
    key: "2",
    label: "Item 2",
  },
];

<Dropdown className="custom-dropdown" items={items} expandIcon={<ExpandIcon />} footer={<div>Footer Content</div>} trigger={["click"]}>
  <a href="#">Click me</a>
</Dropdown>;
```
