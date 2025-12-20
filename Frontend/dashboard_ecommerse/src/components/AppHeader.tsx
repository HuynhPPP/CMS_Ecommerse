import { Dropdown, Layout, Avatar } from 'antd';
import { MoonOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AppHeader = () => {
  const menuItems = [
    {
      key: 'Profile',
      label: 'Profile',
    },
    {
      key: 'Settings',
      label: 'Settings',
    },
    {
      key: 'Logout',
      label: 'Logout',
    },
  ];

  return (
    <Header className='flex justify-between items-center px-6 shadow-sm'>
      <div />
      <div className='flex items-center gap-4'>
        <button className='text-lg cursor-pointer hover:text-blue-500 transition-colors'>
          <MoonOutlined />
        </button>
        <Dropdown placement='bottomRight' menu={{ items: menuItems }}>
          <Avatar
            size='large'
            icon={<UserOutlined />}
            className='cursor-pointer'
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
