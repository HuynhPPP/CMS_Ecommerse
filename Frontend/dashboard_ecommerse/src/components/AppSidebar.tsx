import Sider from 'antd/es/layout/Sider';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const AppSidebar = () => {
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
  ];

  const navigate = useNavigate();

  const { isDark } = useContext(ThemeContext);

  const handleNavigate = (path: any) => {
    navigate(`/${path.key}`);
  };

  return (
    <Sider trigger={null} collapsible style={{ height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className='text-xl font-bold text-blue-600 text-center py-5'>
          ADMIN PANEL
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
