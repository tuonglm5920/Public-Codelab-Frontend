import { Popconfirm as AntPopconfirm, PopconfirmProps as AntPopconfirmProps } from 'antd';
import classNames from 'classnames';
import { FC, ReactNode, useState } from 'react';
import { useDeepCompareEffect, useIsMounted } from '../../../../../hooks';
import { useInitializeContext } from '../../../base';
import { Button, ButtonProps } from '../../Button';
import { isBrowser } from '~/shared/utilities';
import './styles.css';

export interface Props
  extends Pick<
    AntPopconfirmProps,
    'className' | 'children' | 'okText' | 'cancelText' | 'disabled' | 'onCancel' | 'onConfirm' | 'arrow' | 'open'
  > {
  /** The content of the Popconfirm. */
  content?: ReactNode;
  /** Properties for the OK button. */
  okButtonProps?: Pick<ButtonProps, 'className' | 'color' | 'disabled' | 'htmlType' | 'form' | 'onClick' | 'loading'>;
  /** Properties for the cancel button. */
  cancelButtonProps?: Pick<ButtonProps, 'className' | 'color' | 'disabled' | 'htmlType' | 'form' | 'onClick'>;
}

/**
 * Popconfirm component that extends the functionality of the Ant Design Popconfirm component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props} props - The properties for the Popconfirm component.
 * @param {boolean} props.open - Whether the Popconfirm is visible.
 * @param {boolean} [props.arrow=true] - Whether to display an arrow pointing to the reference element.
 * @param {Object} [props.cancelButtonProps] - Properties for the cancel button.
 * @param {string|ReactNode} [props.cancelText] - The text of the cancel button.
 * @param {ReactNode} [props.children] - The content of the Popconfirm.
 * @param {string} [props.className] - Custom CSS class for styling the Popconfirm.
 * @param {string|ReactNode} [props.content] - The content of the Popconfirm.
 * @param {boolean} [props.disabled] - Whether the Popconfirm is disabled.
 * @param {Object} [props.okButtonProps] - Properties for the OK button.
 * @param {string|ReactNode} [props.okText] - The text of the OK button.
 * @param {Function} [props.onCancel] - Callback function triggered when the cancel button is clicked.
 * @param {Function} [props.onConfirm] - Callback function triggered when the OK button is clicked.
 * @returns {ReactNode} The rendered Popconfirm component.
 */
export const Popconfirm: FC<Props> = ({
  arrow = true,
  cancelButtonProps,
  cancelText = 'Cancel',
  children,
  className,
  content,
  disabled,
  okButtonProps,
  okText = 'OK',
  open,
  onCancel,
  onConfirm,
}) => {
  useInitializeContext();
  const isMounted = useIsMounted();
  const [openState, setOpenState] = useState(!isBrowser() ? false : open);

  const handleCancel: AntPopconfirmProps['onCancel'] = event => {
    if (onCancel) {
      onCancel?.(event);
    } else {
      setOpenState(false);
    }
  };
  const handleOk: AntPopconfirmProps['onConfirm'] = event => {
    if (onConfirm) {
      onConfirm?.(event);
    } else {
      setOpenState(false);
    }
  };

  useDeepCompareEffect(() => {
    setOpenState(open);
  }, [open]);

  return (
    <AntPopconfirm
      open={isMounted ? openState : false}
      icon={null}
      arrow={arrow}
      className={classNames('Popconfirm__container', className)}
      overlayClassName="Popconfirm__overlay"
      cancelText={cancelText}
      children={children}
      disabled={disabled}
      okText={okText}
      onCancel={onCancel}
      onConfirm={onConfirm}
      onOpenChange={setOpenState}
      title={
        <div className="Popup__content">
          <div className="Popup__body">{content}</div>
          <div className="Popup__footer">
            <Button {...cancelButtonProps} onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button {...okButtonProps} color={okButtonProps?.color ?? 'primary'} onClick={handleOk}>
              {okText}
            </Button>
          </div>
        </div>
      }
    />
  );
};
