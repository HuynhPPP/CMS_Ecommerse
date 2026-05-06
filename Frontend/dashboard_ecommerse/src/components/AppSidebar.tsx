import Sider from 'antd/es/layout/Sider';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { getSettings, type Settings } from '../services/SettingService';

const AppSidebar = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    getSettings().then(data => setSettings(data)).catch(console.error);
  }, []);

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
    },
    {
      key: 'category',
      icon: <AppstoreOutlined />,
      label: 'Danh mục',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Người dùng',
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cấu hình',
    },
  ];

  const handleNavigate = (path: any) => {
    navigate(`/${path.key}`);
  };

  return (
    <Sider trigger={null} collapsible style={{ height: '100vh', position: 'sticky', top: 0, left: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '40px', objectFit: 'contain' }} />
          ) : (
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1' }}>
              ADMIN PANEL
            </div>
          )}
        </div>
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="inline"
          style={{ flex: 1, borderRight: 0 }}
          defaultSelectedKeys={['dashboard']}
          onClick={handleNavigate}
          items={items}
        />
      </div>
    </Sider>
  );
};

export default AppSidebar;
