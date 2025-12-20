import Sider from 'antd/es/layout/Sider';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

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
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'orders',
      icon: <UploadOutlined />,
      label: 'Orders',
    },
  ];

  const navigate = useNavigate();

  const handleNavigate = (path: any) => {
    navigate(`/${path.key}`);
  };

  return (
    <Sider trigger={null} collapsible>
      <div className='text-xl font-bold text-blue-600 text-center py-5'>
        ADMIN PANEL
      </div>
      <Menu
        theme='dark'
        className='h-screen'
        mode='inline'
        defaultSelectedKeys={['1']}
        onClick={handleNavigate}
        items={items}
      />
    </Sider>
  );
};

export default AppSidebar;
