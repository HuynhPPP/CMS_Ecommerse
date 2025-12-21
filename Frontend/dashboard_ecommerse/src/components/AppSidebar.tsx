import Sider from 'antd/es/layout/Sider';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
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
      label: 'Dashboard',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: 'Category',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
  ];

  const navigate = useNavigate();

  const { isDark } = useContext(ThemeContext);

  const handleNavigate = (path: any) => {
    navigate(`/${path.key}`);
  };

  return (
    <Sider trigger={null} collapsible>
      <div className='text-xl font-bold text-blue-600 text-center py-5'>
        ADMIN PANEL
      </div>
      <Menu
        theme={isDark ? 'dark' : 'light'}
        className='h-screen'
        defaultSelectedKeys={['1']}
        onClick={handleNavigate}
        items={items}
      />
    </Sider>
  );
};

export default AppSidebar;
