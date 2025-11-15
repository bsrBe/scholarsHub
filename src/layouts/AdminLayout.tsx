import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Dropdown, Typography, Badge } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  QuestionCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin'),
    },
    {
      key: 'forms',
      icon: <FileTextOutlined />,
      label: 'Forms',
      onClick: () => navigate('/admin/forms'),
    },
    {
      key: 'task-applications',
      icon: <FileDoneOutlined />,
      label: 'Task Applications',
      onClick: () => navigate('/admin/task-applications'),
    },
    {
      key: 'meetings',
      icon: <CalendarOutlined />,
      label: 'Meetings',
      onClick: () => navigate('/admin/meetings'),
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Users',
      onClick: () => navigate('/admin/users'),
    },
    {
      key: 'faqs',
      icon: <QuestionCircleOutlined />,
      label: 'FAQs',
      onClick: () => navigate('/admin/faqs'),
    },
    {
      key: 'articles',
      icon: <BookOutlined />,
      label: 'Articles',
      onClick: () => navigate('/admin/articles'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings'),
    },
  ];

  const selectedKey = React.useMemo(() => {
    if (location.pathname.startsWith('/admin/meetings')) return 'meetings';
    if (location.pathname.startsWith('/admin/users')) return 'users';
    if (location.pathname.startsWith('/admin/forms')) return 'forms';
    if (location.pathname.startsWith('/admin/task-applications')) return 'task-applications';
    if (location.pathname.startsWith('/admin/faqs')) return 'faqs';
    if (location.pathname.startsWith('/admin/articles')) return 'articles';
    return 'dashboard';
  }, [location.pathname]);

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div className="p-4">
          <Title level={4} className="text-center">Admin Panel</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-between items-center px-6">
          <div className="flex items-center">
            <Title level={4} className="mb-0">Admin Dashboard</Title>
          </div>
          <div className="flex items-center gap-4">
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center cursor-pointer">
                <Avatar
                  icon={<UserOutlined />}
                  className="mr-2"
                />
                <span className="text-white">{user?.name || 'Admin'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
