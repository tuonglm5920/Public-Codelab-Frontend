import { ReactNode } from 'react';
import { FileState } from '../../../Upload/src/types/FileState';

export interface Props<FileResponse extends { src: string }> {
  /** The current state of the image files being managed. */
  filesState: FileState<FileResponse>[];
  /** Function to provide a fallback URL for images that might not be available. */
  fallback?: (fileState: FileState<FileResponse>) => string;
  /** Function to render a custom placeholder for images while they are loading or unavailable. */
  placeholder?: (fileState: FileState<FileResponse>) => ReactNode;
  /** Callback function triggered when an image file is deleted. */
  onDelete?: (fileState: FileState<FileResponse>) => void;
  /** Callback function triggered when an image file is downloaded. */
  onDownload?: (fileState: FileState<FileResponse>) => void;
}
