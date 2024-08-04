# Overview

The `NormalFilesList` component renders a list of files and provides functionality to download and delete files. This component is useful for managing a collection of files, allowing users to perform actions like downloading and deleting individual files.

# Props

| Name         | Type                                  | Description                                            |
| ------------ | ------------------------------------- | ------------------------------------------------------ |
| `filesState` | `FileState<any>[]`                    | The current state of the files being managed.          |
| `onDownload` | `(fileState: FileState<any>) => void` | Callback function triggered when a file is downloaded. |
| `onDelete`   | `(fileState: FileState<any>) => void` | Callback function triggered when a file is deleted.    |

# Usage

```tsx
import React from "react";
import { NormalFilesList } from "./NormalFilesList";
import { FileState } from "./types";

const files: FileState<any>[] = [
  { file: new File(["content"], "example.txt"), status: "uploaded" },
  { file: new File(["content"], "document.pdf"), status: "uploaded" },
];

const handleDownload = (fileState: FileState<any>) => {
  console.log("Downloading file:", fileState.file.name);
};

const handleDelete = (fileState: FileState<any>) => {
  console.log("Deleting file:", fileState.file.name);
};

const App = () => (
  <div>
    <h1>File List</h1>
    <NormalFilesList filesState={files} onDownload={handleDownload} onDelete={handleDelete} />
  </div>
);

export default App;
```
