import { Drawer as AntDrawer, DrawerProps as AntDrawerProps } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';
import { useInitializeContext } from '../../../base';

export interface Props
  extends Pick<
    AntDrawerProps,
    'open' | 'className' | 'maskClosable' | 'onClose' | 'placement' | 'title' | 'closeIcon' | 'footer' | 'children'
  > {
  /** Width of the drawer. */
  width?: number;
  /** Whether the drawer is in loading state. */
  loading?: boolean;
}

/**
 * Drawer component that extends the functionality of the Ant Design Drawer component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props} props - The properties for the Drawer component.
 * @param {boolean} props.open - Whether the drawer is open.
 * @param {string} [props.className] - Custom CSS class for styling the drawer.
 * @param {boolean} [props.maskClosable=true] - Whether to close the drawer when the mask is clicked.
 * @param {Function} [props.onClose] - Callback function triggered when the drawer is closed.
 * @param {string} [props.placement='right'] - The placement of the drawer ('top' | 'right' | 'bottom' | 'left').
 * @param {ReactNode} [props.title] - The title of the drawer.
 * @param {ReactNode} [props.closeIcon] - The custom close icon.
 * @param {ReactNode} [props.footer] - The footer of the drawer.
 * @param {ReactNode} props.children - The content of the drawer.
 * @param {number} [props.width] - Width of the drawer.
 * @param {boolean} [props.loading=false] - Whether the drawer is in loading state.
 * @returns {ReactNode} The rendered Drawer component.
 */
export const Drawer: FC<Props> = ({
  className,
  open,
  maskClosable,
  onClose,
  placement,
  title,
  closeIcon,
  footer,
  width,
  children,
  loading,
}) => {
  useInitializeContext();

  return (
    <AntDrawer
      children={children}
      mask
      keyboard
      destroyOnClose
      className={classNames('Drawer__container', className)}
      maskClosable={loading ? false : maskClosable}
      placement={placement}
      title={title}
      closeIcon={closeIcon}
      footer={footer}
      width={width}
      open={open}
      onClose={onClose}
    />
  );
};
