import { Collapse as AntCollapse, CollapseProps as AntCollapseProps } from 'antd';
import { CollapsibleType } from 'antd/es/collapse/CollapsePanel';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { ReactNode, useMemo, useState } from 'react';
import { useDeepCompareEffect, useIsMounted } from '../../../../../hooks';
import { useInitializeContext } from '../../../base';
import './styles.css';

export interface Props<Key extends string, Accordion extends boolean = false>
  extends Pick<AntCollapseProps, 'className' | 'bordered' | 'collapsible' | 'size'> {
  /** If true, only one panel can be expanded at a time. */
  accordion?: Accordion;
  /** The key(s) of the active panel(s). When `accordion` is true, it expects a single key. Otherwise, it expects an array of keys. */
  value?: Accordion extends true ? Key : Key[];
  /** Callback function triggered when the active panel(s) change. When `accordion` is true, it passes a single key or undefined. Otherwise, it passes an array of keys or undefined. */
  onChange?: Accordion extends true ? (value: Key | undefined) => void : (value: Key[] | undefined) => void;
  /** Array of items to be rendered in the Collapse component. */
  items?: Array<{
    /** Unique key for the item. */
    key: Key;
    /** Label of the item to be displayed in the panel header. */
    label: ReactNode;
    /** Content to be displayed inside the panel. */
    children: ReactNode;
    /** Custom CSS class for styling the item. */
    className?: string;
    /** Callback function triggered when the item is clicked. */
    onClick?: () => void;
    /** If true, the item will be hidden. */
    hidden?: boolean;
    /** Specify if the panel can be collapsed. Can be 'header', 'disabled', or undefined. */
    collapsible?: CollapsibleType;
  }>;
}

/**
 * Collapse component that extends the functionality of the Ant Design Collapse component
 * by providing additional customization and support for stricter type safety.
 * It allows for controlled or uncontrolled states and provides a flexible API for handling multiple panels.
 *
 * @param {Props} props - The properties for the Collapse component.
 * @param {string} [props.className] - Custom CSS class for styling the collapse component.
 * @param {boolean} [props.bordered=true] - Whether to show a border around the collapse component.
 * @param {boolean} [props.accordion] - If true, only one panel can be expanded at a time.
 * @param {Array} [props.items=[]] - Array of items to be rendered in the Collapse component.
 * @param {string | string[]} [props.value] - The key(s) of the active panel(s).
 * @param {Function} [props.onChange] - Callback function triggered when the active panel(s) change.
 * @param {string} [props.collapsible='header'] - Specify if the panel can be collapsed.
 * @param {string} [props.size] - The size of collapse.
 * @returns {ReactNode} The rendered Collapse component.
 */
export const Collapse = <Key extends string, Accordion extends boolean = false>({
  className,
  accordion,
  bordered = true,
  items = [],
  collapsible = 'header',
  value,
  onChange,
  size,
}: Props<Key, Accordion>): ReactNode => {
  useInitializeContext();
  const isMounted = useIsMounted();
  const [activeKeyState, setActiveKeyState] = useState(value);

  const handleChange: AntCollapseProps['onChange'] = key => {
    const isUndefined = isEmpty(key) || null;
    const value = isUndefined ? undefined : (key as Props<Key, Accordion>['value']);
    setActiveKeyState(value);
    onChange?.(value as (Key & Key[]) | undefined);
  };

  useDeepCompareEffect(() => {
    setActiveKeyState(value);
  }, [value]);

  const items_ = useMemo(() => {
    return items.filter(item => !item.hidden);
  }, [items]);

  return (
    <AntCollapse
      size={size}
      collapsible={collapsible}
      bordered={bordered}
      accordion={accordion}
      className={classNames('Collapse__container', className)}
      items={items_}
      activeKey={isMounted ? activeKeyState : undefined}
      onChange={handleChange}
    />
  );
};
