import { CloseOutlined } from '@ant-design/icons';
import { Image as AntImage } from 'antd';
import { ReactNode, useMemo } from 'react';
import { useInitializeContext } from '../../../base';
import { Image } from '../../Image/src/Image';
import { LineProgress } from '../../LineProgress';
import './css/ImageFilesListVertical.css';
import { Props } from './types/Props';

/**
 * ImageFilesListVertical component renders a vertical list of image files and provides functionality
 * to download and delete files. This component also supports fallback URLs and custom placeholders
 * for images that might not be available.
 *
 * @param {Object} props - The properties for the ImageFilesListVertical component.
 * @param {FileState<{ src: string }>[]]} props.filesState - The current state of the image files being managed.
 * @param {function} [props.fallback] - Function to provide a fallback URL for images that might not be available.
 * @param {function} [props.placeholder] - Function to render a custom placeholder for images while they are loading or unavailable.
 * @param {function} [props.onDelete] - Callback function triggered when an image file is deleted.
 * @param {function} [props.onDownload] - Callback function triggered when an image file is downloaded.
 * @returns {ReactNode} The rendered ImageFilesListVertical component.
 */
export const ImageFilesListVertical = <FileResponse extends { src: string }>({
  filesState,
  fallback,
  placeholder,
  onDelete,
  onDownload,
}: Props<FileResponse>): ReactNode => {
  useInitializeContext();

  const renderItem = (item: (typeof filesState)[number]): ReactNode => {
    return (
      <div key={item.uid} className="ImageFilesListVertical__item">
        <div className="ImageFilesListVertical__left">
          <Image src={item.response?.src} fallback={fallback?.(item)} placeholder={placeholder?.(item)} />
        </div>
        <div className="ImageFilesListVertical__right">
          <div className="ImageFilesListVertical__information">
            <div
              className="ImageFilesListVertical__fileName"
              role="button"
              tabIndex={0}
              onKeyDown={() => onDelete?.(item)}
              onClick={() => onDownload?.(item)}
            >
              {item.file.name}
            </div>
          </div>
          {item.status === 'loading' && (
            <LineProgress size={{ width: '100%', height: 4 }} percent={item.progressPercent} />
          )}
        </div>
        <div
          className="ImageFilesListVertical__delete"
          role="button"
          tabIndex={0}
          onKeyDown={() => onDelete?.(item)}
          onClick={() => onDelete?.(item)}
        >
          <CloseOutlined />
        </div>
      </div>
    );
  };

  const imagesSrc = useMemo(() => {
    return filesState.reduce<string[]>((result, fileState) => {
      if (fileState.response?.src) {
        return result.concat(fileState.response?.src);
      }
      return result;
    }, []);
  }, [filesState]);

  return (
    <AntImage.PreviewGroup items={imagesSrc}>
      <div className="ImageFilesListVertical__container">{filesState.map(renderItem)}</div>
    </AntImage.PreviewGroup>
  );
};
