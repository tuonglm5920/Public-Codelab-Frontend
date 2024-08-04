# Overview

The `QRScanner` component is a React-based QR code scanner that integrates seamlessly into web applications. It utilizes the user's camera to scan QR codes and offers customizable callbacks for handling the scan results. The component also provides a responsive UI with loading and error handling states.

# Props

The `QRScanner` component accepts the following props:

| Prop                   | Type                                     | Default | Description                                                                            |
| ---------------------- | ---------------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `maxScansPerSecond`    | `number`                                 | `1`     | Maximum number of scans per second.                                                    |
| `disabledWindowScroll` | `boolean`                                | `true`  | Boolean to control whether scrolling on the window is disabled when open QRScanner.    |
| `open`                 | `boolean`                                | -       | Controls the visibility of the QR scanner.                                             |
| `onClose`              | `() => void`                             | -       | An optional callback that is executed when the scanner finishes its closing animation. |
| `onLoad`               | `(statusRequest: StatusRequest) => void` | -       | Callback when the QR Scanner status changes.                                           |
| `onScan`               | `(data: string) => void`                 | -       | Callback when a QR code is successfully scanned.                                       |
| `Loading`              | `ReactNode` \| `(() => ReactNode)`       | -       | Component or function to render while loading.                                         |
| `Reconnect`            | `ReactNode` \| `(() => ReactNode)`       | -       | Component or function to render for reconnection.                                      |
