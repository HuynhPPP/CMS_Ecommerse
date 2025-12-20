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
      }}
    >
      <AppSidebar />
      <Layout>
        <AppHeader />

        <Content
          style={{
            padding: 24,
            minHeight: 280,
            borderRadius: 8,
          }}
        >
          <Outlet /> {/* Nội dung "Content" được render */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
