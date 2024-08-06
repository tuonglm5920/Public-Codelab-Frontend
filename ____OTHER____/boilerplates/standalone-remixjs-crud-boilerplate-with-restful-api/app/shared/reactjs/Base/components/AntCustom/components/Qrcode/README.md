# Overview

The Qrcode component extends the functionality of the Ant Design QRCode component by providing additional customization and support for stricter type safety.

# Props

| Prop      | Type   | Default | Description                                               |
| --------- | ------ | ------- | --------------------------------------------------------- |
| className | string | -       | Custom CSS class for styling the QR code.                 |
| image     | string | -       | URL of the image to display in the center of the QR code. |
| size      | number | -       | Size of the QR code.                                      |
| value     | string | -       | Value to encode in the QR code.                           |

# Usage

```jsx
import { Qrcode } from "path/to/Qrcode";

// Example usage
<Qrcode className="custom-qrcode" image="https://example.com/image.png" size={128} value="https://example.com" />;
```
