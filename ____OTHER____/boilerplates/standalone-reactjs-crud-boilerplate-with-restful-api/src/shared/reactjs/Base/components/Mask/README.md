# Overview

The `Mask` component is designed to draw the user's attention to a specific interactive element on a webpage by overlaying a semi-transparent mask on the entire page. A specific area, corresponding to the interactive element, is carved out from the mask, directing the focus towards it.

# Props

| Prop       | Type                                          | Description                                                                                                                                                |
| ---------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `padding`  | `number`                                      | The amount of space (in pixels) around the highlighted content, effectively creating a margin between the content and the mask.                            |
| `children` | `(domAttachedRef: RefObject<T>) => ReactNode` | A function that returns the ReactNode to be highlighted. It receives a `domAttachedRef` which should be attached to the DOM element you want to highlight. |
