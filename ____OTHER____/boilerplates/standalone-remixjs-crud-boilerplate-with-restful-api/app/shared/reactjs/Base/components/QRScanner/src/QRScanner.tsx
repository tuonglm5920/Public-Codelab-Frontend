import classNames from 'classnames';
import QrScanner from 'qr-scanner';
import { FC, ReactNode, useRef, useState } from 'react';
import { useDeepCompareEffect, useIsMounted, useMount } from '../../../hooks';
import { AsyncComponent } from '../../AsyncComponent';
import { CloseIcon } from './icons/CloseIcon';
import './styles.css';

// Type definition for the different statuses of the QR Scanner request
type StatusRequest = 'idle' | 'requesting' | 'success' | 'failure';

export interface Props {
  /** Optional boolean to control whether scrolling on the window is disabled when open QRScanner */
  disabledWindowScroll?: boolean;
  /** Indicates whether the QR scanner is open. */
  open: boolean;
  /** Callback function triggered when the click close icon. */
  onClose?: () => void;
  /* Optional max number of scans per second, defaults to 1 if not provided. */
  maxScansPerSecond?: number;
  /* Callback function triggered when the QR Scanner status changes. */
  onLoad?: (statusRequest: StatusRequest) => void;
  /* Callback function triggered when the QR code is successfully scanned. */
  onScan?: (data: string) => void;
  /* Component or function to render while the QR Scanner is loading. */
  Loading?: ReactNode | (() => ReactNode);
  /* Component or function to render when the QR Scanner needs to reconnect. */
  Reconnect?: ReactNode | (() => ReactNode);
  /** RTL mode */
  rtl?: boolean;
}

/**
 * QRScanner component.
 *
 * This component provides a QR code scanning functionality using the device's camera.
 *
 * @param {Props} props - The props for the component.
 * @param {number} [props.maxScansPerSecond=1] - The maximum number of scans per second.
 * @param {boolean} [props.disabledWindowScroll] - Optional boolean to control whether scrolling on the window is disabled when open QRScanner
 * @param {boolean} [props.open] - Determines if the QR scanner is open. When true, the scanner is visible and open; when false, it is closed.
 * @param {Function} [props.onClose] - Optional callback function that is called when the QR scanner is closed. It's triggered at the end of the close animation.
 * @param {(statusRequest: StatusRequest) => void} [props.onLoad] - Callback when the QR Scanner status changes.
 * @param {(data: string) => void} [props.onScan] - Callback when a QR code is successfully scanned.
 * @param {ReactNode | (() => ReactNode)} [props.Loading] - Component or function to render while loading.
 * @param {ReactNode | (() => ReactNode)} [props.Reconnect] - Component or function to render for reconnection.
 * @param {boolean} [props.rtl] - RTL mode
 */
export const QRScanner: FC<Props> = ({
  disabledWindowScroll = true,
  open,
  onClose,
  maxScansPerSecond = 1,
  onLoad,
  onScan,
  Loading,
  Reconnect,
  rtl = false,
}) => {
  /** Reference to the 'isMounted' state to handle component animation */
  const isMounted = useIsMounted();
  /** Ref to the HTMLVideoElement for displaying the camera feed */
  const videoRef = useRef<HTMLVideoElement | null>(null);
  /** Ref to the QrScanner instance */
  const scannerRef = useRef<QrScanner | null>(null);
  /** A reference to store the original value of the body's overflow property. */
  const originalBodyOverflow = useRef<string | null>(null);
  /** Determines the animation direction for opening and closing the QR scanner based on the user's interaction with the page. */
  const animationDirection = useRef<'slideDown' | 'slideUp'>('slideDown');

  /** State for tracking the connection status of the camera */
  const [statusConnectCamera, setStatusConnectCamera] = useState<StatusRequest>('idle');

  /** Handles the failure of requesting access to the camera and setting up the QR scanner */
  const handleRequestCameraFailure = (): void => {
    setStatusConnectCamera('failure');
  };

  /** Handles the failure of requesting access to the camera and setting up the QR scanner */
  const handleRequestCameraSuccess = (): void => {
    setStatusConnectCamera('success');
  };

  /** Handles the process of requesting access to the camera and setting up the QR scanner */
  const handleRequestCamera = (): void => {
    if (videoRef.current) {
      setStatusConnectCamera('requesting');
      scannerRef?.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = new QrScanner(videoRef.current, result => onScan?.(result.data), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: 'environment',
        maxScansPerSecond,
      });
      QrScanner.hasCamera()
        .then(hasCamera => {
          if (hasCamera) {
            scannerRef.current?.start().then(handleRequestCameraSuccess).catch(handleRequestCameraFailure);
          } else {
            handleRequestCameraFailure();
          }
        })
        .catch(handleRequestCameraFailure);
    }
  };

  /**
   * Determines the animation direction for showing or hiding the QR Scanner.
   * This function sets the animation direction based on the position of the mouse cursor
   * at the time of the event. If the cursor is in the upper half of the screen, it sets
   * the direction to 'slideDown', otherwise to 'slideUp'. This provides a more intuitive
   * and responsive user experience.
   *
   * @param {MouseEvent} event - The mouse event used to determine cursor position.
   */
  const handlePickAnimationDirection = (event: MouseEvent): void => {
    if (open) {
      return;
    }
    if (event.clientY < window.innerHeight / 2) {
      animationDirection.current = 'slideDown';
    } else {
      animationDirection.current = 'slideUp';
    }
  };

  /**
   * Handles keyboard interactions with the QR Scanner component.
   * Specifically, this function listens for the 'Escape' key event. When this key is pressed,
   * the onClose callback is invoked, which should contain logic to close the QR Scanner. This
   * enhances accessibility and user experience by allowing users to easily close the scanner
   * using the keyboard.
   *
   * @param {KeyboardEvent} event - The keyboard event used to detect key presses.
   */
  const handleKeypress = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onClose?.();
    }
  };

  useMount(() => {
    window.addEventListener('keypress', handleKeypress);
    return () => {
      window.removeEventListener('keypress', handleKeypress);
    };
  });

  useDeepCompareEffect(() => {
    window.addEventListener('mousemove', handlePickAnimationDirection);
    return () => {
      window.removeEventListener('mousemove', handlePickAnimationDirection);
    };
  }, [open]);

  useDeepCompareEffect(() => {
    onLoad?.(statusConnectCamera);
  }, [statusConnectCamera]);

  useDeepCompareEffect(() => {
    if (open && statusConnectCamera !== 'success') {
      handleRequestCamera();
      originalBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      setStatusConnectCamera('idle');
      document.body.style.overflow = originalBodyOverflow.current as string;
    }
    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
    };
  }, [open, disabledWindowScroll]);

  const renderLoading = (): ReactNode => {
    return <div className="QRScanner__loading">{typeof Loading === 'function' ? Loading() : Loading}</div>;
  };

  const renderFailure = (): ReactNode => {
    return (
      <div className="QRScanner__failure" onClick={handleRequestCamera}>
        {typeof Reconnect === 'function' ? Reconnect() : Reconnect}
      </div>
    );
  };

  return (
    <div
      className={classNames('QRScanner__container', {
        QRScanner__openning: open,
        'QRScanner__openning--up': open && animationDirection.current === 'slideUp',
        'QRScanner__openning--down': open && animationDirection.current === 'slideDown',
        'QRScanner__closing--up': isMounted && !open && animationDirection.current === 'slideDown',
        'QRScanner__closing--down': isMounted && !open && animationDirection.current === 'slideUp',
      })}
    >
      <div className="QRScanner__content">
        <AsyncComponent
          isLoading={statusConnectCamera === 'requesting'}
          isFailure={statusConnectCamera === 'failure'}
          Loading={renderLoading}
          Failure={renderFailure}
          Success={renderLoading}
        />
        <video className="QRScanner__scanner" ref={videoRef} />
      </div>
      <div
        onClick={onClose}
        className={classNames('QRScanner__close', rtl ? 'QRScanner__close--left' : 'QRScanner__close--right')}
      >
        <CloseIcon className="QRScanner__closeIcon" />
      </div>
    </div>
  );
};
