# Overview

The Table component extends the functionality of the Ant Design Table component by providing additional customization and support for stricter type safety.

# Props

| Prop                | Type     | Default  | Description                                                    |
| ------------------- | -------- | -------- | -------------------------------------------------------------- |
| currentPage         | number   | -        | The current page number.                                       |
| pageSize            | number   | -        | The number of items per page.                                  |
| totalRecords        | number   | -        | The total number of records.                                   |
| onChange            | function | -        | Callback function triggered when the page or pageSize changes. |
| plural              | function | -        | Function to generate a plural label for the total count.       |
| singular            | function | -        | Function to generate a singular label for the total count.     |
| paginationMode      | string   | 'sticky' | The pagination mode.                                           |
| columns             | array    | []       | An array of columns to be displayed in the table.              |
| nonePagination      | boolean  | -        | Whether to disable pagination.                                 |
| showSizeChanger     | boolean  | false    | Whether to show the size changer in pagination.                |
| paginationClassName | string   | -        | Custom CSS class for the pagination.                           |
| locale              | object   | -        | Locale object for the pagination.                              |
| sizeChangerOptions  | array    | []       | Options for the size changer dropdown.                         |
| bordered            | boolean  | true     | Whether the table has borders.                                 |
| className           | string   | -        | Custom CSS class for the table.                                |
| dataSource          | array    | -        | Data source for the table.                                     |
| expandable          | object   | -        | Expandable configuration for the table.                        |
| direction           | string   | -        | Direction of the table layout (ltr/rtl).                       |
| indentSize          | number   | -        | Indentation size for the expandable rows.                      |
| loading             | boolean  | -        | Loading state of the table.                                    |
| rowKey              | function | -        | Key of each row.                                               |
| summary             | function | -        | Summary row configuration.                                     |
| size                | string   | -        | Size of the table (small/middle/large).                        |

# Usage

```jsx
import { Table } from "path/to/Table";

// Example usage
const dataSource = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

<Table currentPage={1} pageSize={10} totalRecords={100} dataSource={dataSource} columns={columns} onChange={(page, pageSize) => console.log(page, pageSize)} />;
```
