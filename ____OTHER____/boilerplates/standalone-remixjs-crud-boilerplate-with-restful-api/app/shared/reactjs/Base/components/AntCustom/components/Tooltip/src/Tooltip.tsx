import { Tooltip as AntTooltip, TooltipProps as AntTooltipProps } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './styles.css';
import { useInitializeContext } from '../../../base';

export interface Props
  extends Pick<AntTooltipProps, 'className' | 'arrow' | 'trigger' | 'color' | 'children' | 'overlayClassName'> {
  /** Whether the tooltip is disabled. */
  disabled?: boolean;
  /** The content of the tooltip. */
  content?: AntTooltipProps['title'];
}

/**
 * Tooltip component that extends the functionality of the Ant Design Tooltip component
 * by providing additional customization and support for stricter type safety.
 *
 * @param {Props} props - The properties for the Tooltip component.
 * @param {string} [props.className] - Custom CSS class for styling the tooltip.
 * @param {boolean} [props.arrow=true] - Whether to display an arrow pointing to the reference element.
 * @param {ReactNode} [props.children] - The trigger of the tooltip.
 * @param {string} [props.color] - The color of the tooltip.
 * @param {string|ReactNode} [props.content] - The content of the tooltip.
 * @param {string} [props.trigger] - The trigger mode which can be 'hover', 'focus', 'click', or 'contextMenu'.
 * @param {string} [props.overlayClassName] - Custom CSS class for the overlay.
 * @param {boolean} [props.disabled=false] - Whether the tooltip is disabled.
 * @returns {ReactNode} The rendered Tooltip component.
 */
export const Tooltip = ({
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
    <AntTooltip
      destroyTooltipOnHide
      open={disabled ? false : undefined}
      arrow={arrow}
      children={children}
      color={color}
      title={content}
      trigger={trigger}
      className={classNames('Tooltip__container', className)}
      overlayClassName={classNames('Tooltip__overlay', overlayClassName)}
    />
  );
};
