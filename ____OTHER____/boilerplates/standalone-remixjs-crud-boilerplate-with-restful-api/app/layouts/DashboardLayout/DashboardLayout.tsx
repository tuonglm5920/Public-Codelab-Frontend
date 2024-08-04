import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link, Outlet } from '@remix-run/react';
import classNames from 'classnames';
import { Suspense, useEffect, useState } from 'react';
import { Logo } from './components/Logo';
import { Notification } from './components/Notification';
import { UserDropdown } from './components/UserDropdown';
import { useGetNavData } from './hooks/useGetNavData';
import { SessionData } from '~/packages/common/Auth/models/SessionData';
import { Button, MenuVertical, useMediaQuery } from '~/shared/reactjs';
import { LayoutContainer, LayoutContent, LayoutHeader, LayoutSider } from '~/shared/reactjs';
import './styles.css';

interface Props {
  sessionData: SessionData;
}

export const DashboardLayout = ({ sessionData }: Props) => {
  const { items, openKeys, setOpenKeys, selectedKey } = useGetNavData();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapseMenu = () => {
    setCollapsed(isMobile ? true : !collapsed);
  };
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  return (
    <LayoutContainer>
      <LayoutSider width={240} collapsed={collapsed} className="Dashboard__sidebar">
        <MenuVertical
          inlineIndent={23}
          openKeys={openKeys}
          onOpenChange={value => setOpenKeys(value ?? [])}
          selectedKey={selectedKey}
          Header={
            <Link to="/dashboard">
              <Logo collapsed={collapsed} />
            </Link>
          }
          items={items}
        />
      </LayoutSider>
      <LayoutContainer className="Dashboard__content">
        <LayoutHeader className="Dashboard__header">
          <div className="Dashboard__headerContent">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleCollapseMenu}
              className={classNames(isMobile ? 'invisible' : 'visible')}
            />
            <div className="Dashboard__headerRight">
              <Notification />
              <UserDropdown sessionData={sessionData} />
            </div>
          </div>
        </LayoutHeader>
        <LayoutContent>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </LayoutContent>
      </LayoutContainer>
    </LayoutContainer>
  );
};
