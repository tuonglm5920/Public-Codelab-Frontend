import { CloseOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import { useInitializeContext } from '../../../base';
import { Image } from '../../Image';
import { FileState } from '../../Upload/src/types/FileState';
import './styles.css';

export interface Props<FileResponse extends { src: string }> {
  /** The state of the image file being managed. */
  fileState: FileState<FileResponse>;
  /** Callback function triggered when the image file is deleted. */
  onDelete?: () => void;
}

/**
 * ImageFile component renders a single image file and provides functionality to delete the file.
 *
 * @param {Object} props - The properties for the ImageFile component.
 * @param {FileState<{ src: string }>} props.fileState - The state of the image file being managed.
 * @param {function} [props.onDelete] - Callback function triggered when the image file is deleted.
 * @returns {ReactNode} The rendered ImageFile component.
 */
export const ImageFile = <FileResponse extends { src: string }>({
  fileState,
  onDelete,
}: Props<FileResponse>): ReactNode => {
  useInitializeContext();

  return (
    <div className="ImageFile__container">
      <Image className="ImageFile__image" preview={false} src={fileState.response?.src} />
      <div className="ImageFile__delete" role="button" tabIndex={0} onKeyDown={onDelete} onClick={onDelete}>
        <CloseOutlined />
      </div>
    </div>
  );
};
