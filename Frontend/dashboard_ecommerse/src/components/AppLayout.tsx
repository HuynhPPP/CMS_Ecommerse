import { Layout } from 'antd';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <Layout
      style={{
        height: '100vh',
        overflow: 'hidden', // Ngăn toàn bộ trang bị cuộn
      }}
    >
      <AppSidebar />
      <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppHeader />

        <Content
          style={{
            padding: 24,
            overflowY: 'auto', // Chỉ cho phép cuộn bên trong Content
            flex: 1, // Chiếm trọn không gian còn lại
          }}
        >
          <Outlet /> {/* Nội dung "Content" được render */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
