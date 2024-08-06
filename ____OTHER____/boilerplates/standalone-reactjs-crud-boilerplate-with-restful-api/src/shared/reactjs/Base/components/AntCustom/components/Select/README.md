# SelectMultiple

## Overview

The `SelectMultiple` component extends the functionality of the Ant Design Select component by providing support for selecting multiple options while ensuring type safety. It enforces stricter type checks compared to the standard Ant Design Select component.

## Props

| Name                    | Type                                                                                       | Default                | Description                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| options                 | `Option<ValueType[number], RawData>[]`                                                     | -                      | An array of options for the SelectMultiple component.                                                        |
| value                   | `ValueType[]`                                                                              | -                      | The current value(s) of the SelectMultiple component.                                                        |
| onChange                | `(value: ValueType[] \| undefined, option?: Option<ValueType[number], RawData>[]) => void` | -                      | Callback function invoked when the value(s) of the SelectMultiple component changes.                         |
| className               | `string`                                                                                   | -                      | Custom CSS class for styling the component.                                                                  |
| allowClear              | `boolean`                                                                                  | `true`                 | Whether to show a clear button allowing the user to clear the input.                                         |
| loading                 | `boolean`                                                                                  | -                      | Whether the component is in a loading state.                                                                 |
| notFoundContent         | `ReactNode`                                                                                | -                      | Content to display when no options match the input.                                                          |
| placeholder             | `string`                                                                                   | -                      | Placeholder text to display when the input is empty.                                                         |
| disabled                | `boolean`                                                                                  | -                      | Whether the SelectMultiple component is disabled.                                                            |
| autoClearSearchValue    | `boolean`                                                                                  | `true`                 | Whether to clear the search input when an option is selected.                                                |
| filterOption            | `boolean \| ((inputValue: string, option: Option<ValueType[number], RawData>) => boolean)` | `baseFilterOption`     | Custom filter function to determine whether an option should be shown in the dropdown.                       |
| direction               | `string`                                                                                   | -                      | The direction of the dropdown menu ('ltr' or 'rtl').                                                         |
| optionLabelProp         | `'displayLabel'`                                                                           | -                      | Prop specifying the property of the option object to be used as the label. If set, should be 'displayLabel'. |
| readOnly                | `boolean`                                                                                  | `false`                | If true, the select is read-only and cannot be changed by the user.                                          |
| valueVariant            | `'controlled-state' \| 'uncontrolled-state'`                                               | `'uncontrolled-state'` | Determines if the select is controlled or uncontrolled state.                                                |
| searchValue             | `string`                                                                                   | -                      | The value of the search input.                                                                               |
| open                    | `boolean`                                                                                  | -                      | Whether the dropdown menu is open.                                                                           |
| onDropdownVisibleChange | `Function`                                                                                 | -                      | Callback function that is triggered when the dropdown visibility changes.                                    |
| onSearch                | `Function`                                                                                 | -                      | Callback function that is triggered when the search input value changes.                                     |
| size                    | `string`                                                                                   | -                      | The size of select.                                                                                          |
| showSearch              | `boolean`                                                                                  | `true`                 | Whether select is searchable.                                                                                |

## Usage

```jsx
import { SelectMultiple } from "select-multiple-component";

// Example usage
const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const handleChange = (value) => {
  console.log("Selected value(s):", value);
};

<SelectMultiple options={options} value={["option1", "option2"]} onChange={handleChange} placeholder="Select option(s)" />;
```

# SelectSingle

## Overview

The `SelectSingle` component extends the functionality of the Ant Design Select component by providing support for selecting a single option while ensuring type safety. It enforces stricter type checks compared to the standard Ant Design Select component.

## Props

| Name                    | Type                                                                               | Default                | Description                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| options                 | `Option<ValueType, RawData>[]`                                                     | -                      | An array of options for the SelectSingle component.                                                          |
| value                   | `ValueType`                                                                        | -                      | The current value of the SelectSingle component.                                                             |
| onChange                | `(value: ValueType \| undefined, option?: Option<ValueType, RawData>) => void`     | -                      | Callback function invoked when the value of the SelectSingle component changes.                              |
| className               | `string`                                                                           | -                      | Custom CSS class for styling the component.                                                                  |
| allowClear              | `boolean`                                                                          | -                      | Whether to show a clear button allowing the user to clear the input.                                         |
| loading                 | `boolean`                                                                          | -                      | Whether the component is in a loading state.                                                                 |
| notFoundContent         | `ReactNode`                                                                        | -                      | Content to display when no options match the input.                                                          |
| placeholder             | `string`                                                                           | -                      | Placeholder text to display when the input is empty.                                                         |
| disabled                | `boolean`                                                                          | -                      | Whether the SelectSingle component is disabled.                                                              |
| autoClearSearchValue    | `boolean`                                                                          | `true`                 | Whether to clear the search input when an option is selected.                                                |
| filterOption            | `boolean \| ((inputValue: string, option: Option<ValueType, RawData>) => boolean)` | `baseFilterOption`     | Custom filter function to determine whether an option should be shown in the dropdown.                       |
| direction               | `string`                                                                           | -                      | The direction of the dropdown menu ('ltr' or 'rtl').                                                         |
| optionLabelProp         | `'displayLabel'`                                                                   | -                      | Prop specifying the property of the option object to be used as the label. If set, should be 'displayLabel'. |
| readOnly                | `boolean`                                                                          | `false`                | If true, the select is read-only and cannot be changed by the user.                                          |
| valueVariant            | `'controlled-state' \| 'uncontrolled-state'`                                       | `'uncontrolled-state'` | Determines if the select is controlled or uncontrolled state.                                                |
| searchValue             | `string`                                                                           | -                      | The value of the search input.                                                                               |
| open                    | `boolean`                                                                          | -                      | Whether the dropdown menu is open.                                                                           |
| onDropdownVisibleChange | `Function`                                                                         | -                      | Callback function that is triggered when the dropdown visibility changes.                                    |
| onSearch                | `Function`                                                                         | -                      | Callback function that is triggered when the search input value changes.                                     |
| size                    | `string`                                                                           | -                      | The size of select.                                                                                          |
| showSearch              | `boolean`                                                                          | `true`                 | Whether select is searchable.                                                                                |

## Usage

```jsx
import { SelectSingle } from "select-single-component";

// Example usage
const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];
```
