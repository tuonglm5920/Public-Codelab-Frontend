# Overview

The `ImageFilesList` component renders a list of image files and provides functionality to download and delete files. This component also supports fallback URLs and custom placeholders for images that might not be available.

# Props

| Name          | Type                                                   | Description                                                                               |
| ------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `filesState`  | `FileState<{ src: string }>[]`                         | The current state of the image files being managed.                                       |
| `fallback`    | `(fileState: FileState<{ src: string }>) => string`    | Function to provide a fallback URL for images that might not be available.                |
| `placeholder` | `(fileState: FileState<{ src: string }>) => ReactNode` | Function to render a custom placeholder for images while they are loading or unavailable. |
| `onDelete`    | `(fileState: FileState<{ src: string }>) => void`      | Callback function triggered when an image file is deleted.                                |
| `onDownload`  | `(fileState: FileState<{ src: string }>) => void`      | Callback function triggered when an image file is downloaded.                             |

# Usage

```tsx
import React from "react";
import { FileState } from "./types";

const imageFiles: FileState<{ src: string }>[] = [
  { file: new File(["content"], "image1.png"), status: "uploaded", data: { src: "path/to/image1.png" } },
  { file: new File(["content"], "image2.jpg"), status: "uploaded", data: { src: "path/to/image2.jpg" } },
];

const handleFallback = (fileState: FileState<{ src: string }>) => {
  return "path/to/fallback.jpg";
};

const handlePlaceholder = (fileState: FileState<{ src: string }>) => {
  return <div>Loading...</div>;
};

const handleDownload = (fileState: FileState<{ src: string }>) => {
  console.log("Downloading image:", fileState.file.name);
};

const handleDelete = (fileState: FileState<{ src: string }>) => {
  console.log("Deleting image:", fileState.file.name);
};

const App = () => (
  <div>
    <h1>Image List</h1>
    <ImageFilesListHorizontal filesState={imageFiles} fallback={handleFallback} placeholder={handlePlaceholder} onDownload={handleDownload} onDelete={handleDelete} />
    <ImageFilesListVertical filesState={imageFiles} fallback={handleFallback} placeholder={handlePlaceholder} onDownload={handleDownload} onDelete={handleDelete} />
  </div>
);

export default App;
```
