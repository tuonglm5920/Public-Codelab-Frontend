import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { FC, useMemo } from 'react';
import './styles.css';

export interface Props {
  /** An array of items to be displayed in the dropdown menu. Each item should be of type ItemType and can optionally have a 'hidden' property to hide it from the menu. */
  items: Array<ItemType & { hidden?: boolean }>;
}

/**
 * TableActions component displays a dropdown menu of actions for a table.
 * @param {Props} props - The component props.
 * @param {Array<ItemType & { hidden?: boolean }>} props.items - An array of items to be displayed in the dropdown menu.
 * Each item should be of type ItemType and can optionally have a 'hidden' property to hide it from the menu.
 * @returns {JSX.Element} The rendered TableActions component.
 */
export const TableActions: FC<Props> = ({ items }) => {
  const items_ = useMemo(() => {
    return items.filter(item => !item.hidden);
  }, [items]);
  return (
    <Dropdown menu={{ items: items_ }}>
      <div className="TableActions__container">
        <MoreOutlined />
      </div>
    </Dropdown>
  );
};
