# Overview

The `Scrollbar` component provides custom scrollbar functionality for scrolling content. It renders both horizontal and vertical scrollbars along with their respective thumb elements. The appearance and behavior of the scrollbar can be customized using various props.

# Props

The `Scrollbar` component accepts the following props:

| Property              | Description                                                                                             | Type                                                                                                                                                      | Default     |
| --------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| autoHide              | Enable auto-hide mode. When `true` tracks will hide automatically and are only visible while scrolling. | `boolean`                                                                                                                                                 | `false`     |
| autoHideDuration      | Duration for hide animation in ms.                                                                      | `number`                                                                                                                                                  | 200         |
| autoHideTimeout       | Hide delay in ms.                                                                                       | `number`                                                                                                                                                  | 1000        |
| classes               | extra custom className/s to any of the subcomponents                                                    | <code>Partial<Record<'root' &#124; 'view' &#124; 'trackVertical' &#124; 'trackHorizontal' &#124; 'thumbVertical' &#124; 'thumbHorizontal', string></code> | `{}`        |
| onScroll              | Event handler                                                                                           | `(e: React.UIEvent<HTMLElement>) => void`                                                                                                                 | `undefined` |
| onScrollFrame         | Runs inside the animation frame. Type of `ScrollValues` you can check below                             | `(values: ScrollValues) => void`                                                                                                                          | `undefined` |
| onScrollStart         | Called when scrolling starts                                                                            | `() => void`                                                                                                                                              | `undefined` |
| onScrollStop          | Called when scrolling stops                                                                             | `() => void`                                                                                                                                              | `undefined` |
| onUpdate              | Called when ever the component is updated. Runs inside the animation frame                              | `(values: ScrollValues) => void`                                                                                                                          | `undefined` |
| renderThumbHorizontal | Horizontal thumb element                                                                                | `(props: HTMLAttributes<HTMLDivElement>) => JSX.Element`                                                                                                  | `undefined` |
| renderThumbVertical   | Vertical thumb element                                                                                  | `(props: HTMLAttributes<HTMLDivElement>) => JSX.Element`                                                                                                  | `undefined` |
| renderTrackHorizontal | Horizontal track element                                                                                | `(props: HTMLAttributes<HTMLDivElement>) => JSX.Element`                                                                                                  | `undefined` |
| renderTrackVertical   | Vertical track element                                                                                  | `(props: HTMLAttributes<HTMLDivElement>) => JSX.Element`                                                                                                  | `undefined` |
| universal             | Enable universal rendering (SSR). [Learn how to use universal rendering](/usage#universal-rendering)    | `boolean`                                                                                                                                                 | `false`     |
| direction             | RTL support                                                                                             | Direction                                                                                                                                                 | `ltr`       |

# Methods

- scrollTop(top = 0): scroll to the top value
- scrollLeft(left = 0): scroll to the left value
- scrollToTop(): scroll to top
- scrollToBottom(): scroll to bottom
- scrollToLeft(): scroll to left
- scrollToRight(): scroll to right
  getScrollLeft(): get scrollLeft value
  getScrollTop(): get scrollTop value
  getScrollWidth(): get scrollWidth value
  getScrollHeight(): get scrollHeight value
  getClientWidth(): get view client width
  getClientHeight(): get view client height
  getValues(): get an object with values about the current position.
