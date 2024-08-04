import { Popover as AntPopover, PopoverProps as AntPopoverProps } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './styles.css';
import { useInitializeContext } from '../../../base';

export interface Props
  extends Pick<AntPopoverProps, 'className' | 'arrow' | 'trigger' | 'color' | 'children' | 'overlayClassName'> {
  /** Whether the popover is disabled. */
  disabled?: boolean;
  /** The content of the popover. */
  content: AntPopoverProps['content'];
}

/**
 * Popover component that extends the functionality of the Ant Design Popover component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props} props - The properties for the Popover component.
 * @param {string} [props.className] - Custom CSS class for styling the popover.
 * @param {boolean} [props.arrow=true] - Whether to display an arrow pointing to the reference element.
 * @param {ReactNode} [props.children] - The trigger of the popover.
 * @param {string} [props.color] - The color of the popover.
 * @param {string|ReactNode} [props.content] - The content of the popover.
 * @param {string} [props.trigger] - The trigger mode which can be 'hover', 'focus', 'click', or 'contextMenu'.
 * @param {string} [props.overlayClassName] - Custom CSS class for the overlay.
 * @param {boolean} [props.disabled=false] - Whether the popover is disabled.
 * @returns {ReactNode} The rendered Popover component.
 */
export const Popover = ({
  className,
  arrow = true,
  children,
  color,
  content,
  trigger,
  overlayClassName,
  disabled = false,
}: Props): ReactNode => {
  useInitializeContext();

  return (
    <AntPopover
      destroyTooltipOnHide
      open={disabled ? false : undefined}
      arrow={arrow}
      children={children}
      color={color}
      content={content}
      trigger={trigger}
      className={classNames('Popover__container', className)}
      overlayClassName={classNames('Popover__overlay', overlayClassName)}
    />
  );
};
