import { Dropdown, Layout, Avatar } from 'antd';
import { BulbOutlined, MoonOutlined, UserOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const { Header } = Layout;

const AppHeader = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const storeUrl = import.meta.env.DEV ? 'http://localhost:5174/' : 'https://cms-ecommerse-wyrm.vercel.app/';

  const menuItems = [
    {
      key: 'MyStore',
      label: (
        <a href={storeUrl} target="_blank" rel="noopener noreferrer">
          Cửa hàng của tôi
        </a>
      ),
    },
  ];

  return (
    <Header className='flex justify-between items-center px-6 shadow-sm'>
      <div />
      <div className='flex items-center gap-4'>
        <button
          className='text-lg cursor-pointer hover:text-blue-500 transition-colors'
          onClick={toggleTheme}
        >
          {isDark ? <BulbOutlined /> : <MoonOutlined />}
        </button>
        <Dropdown placement='bottomRight' menu={{ items: menuItems }}>
          {/* <Avatar
            size='large'
            icon={<UserOutlined />}
            className='cursor-pointer'
          /> */}
          <div className='cursor-pointer'>
            <img src="/avatar.png" alt="Profile" className='w-11 h-11 rounded-full object-cover' />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
