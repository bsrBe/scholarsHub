import React, { useEffect, useState, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  message,
  Popconfirm,
  Avatar,
  Drawer,
  Descriptions,
  Spin,
} from 'antd';
import { SearchOutlined, UserOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import adminService, { UserItem } from '@/services/adminService';
import dayjs from 'dayjs';

const { Option } = Select;

const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Consultant', value: 'consultant' },
  { label: 'Admin', value: 'admin' },
];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState<{ role?: string; search?: string }>({});
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchUsers = async (page = pagination.current, pageSize = pagination.pageSize) => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({
        page,
        limit: pageSize,
        role: filters.role,
        search: filters.search,
      });

      setUsers(response.items);
      setPagination({ current: response.page, pageSize: response.limit, total: response.total });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.search]);

  const handleTableChange = (pag: any) => {
    const { current, pageSize } = pag;
    fetchUsers(current, pageSize);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      message.success('Role updated');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      message.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      message.success('User deleted');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const openUserDrawer = (user: UserItem) => {
    setViewingUser(user);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setViewingUser(null);
  };

  const columns = useMemo(
    () => [
      {
        title: 'User',
        dataIndex: 'name',
        key: 'name',
        render: (_: string, record: UserItem) => (
          <Space>
            <Avatar src={record.profileImageUrl} icon={<UserOutlined />} />
            <div>
              <div className="font-medium">{record.name || 'N/A'}</div>
              <span className="text-gray-500 text-xs">{record.email}</span>
            </div>
          </Space>
        ),
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role: string, record: UserItem) => (
          <Select value={role} onChange={(value) => handleRoleChange(record._id, value)} style={{ width: 140 }}>
            {roleOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value: string) => dayjs(value).format('MMM D, YYYY'),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: UserItem) => (
          <Space>
            <Button icon={<EyeOutlined />} type="link" onClick={() => openUserDrawer(record)}>
              View
            </Button>
            <Popconfirm
              title="Delete user"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button icon={<DeleteOutlined />} danger type="link">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <span className="text-gray-500">View, filter, and manage platform users</span>
        </div>
      </div>

      <CardFilters
        filters={filters}
        onRoleChange={(role) => setFilters((prev) => ({ ...prev, role }))}
        onSearch={(search) => setFilters((prev) => ({ ...prev, search }))}
      />

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `${total} users`,
        }}
        onChange={handleTableChange}
      />

      <Drawer
        title="User Details"
        width={420}
        onClose={closeDrawer}
        open={drawerVisible}
        destroyOnClose
      >
        {!viewingUser ? (
          <Spin />
        ) : (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">{viewingUser.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color="blue">{viewingUser.role}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(viewingUser.createdAt).format('MMM D, YYYY h:mm A')}
            </Descriptions.Item>
            <Descriptions.Item label="Profile Image">
              {viewingUser.profileImageUrl ? (
                <Avatar size={48} src={viewingUser.profileImageUrl} />
              ) : (
                <Avatar size={48} icon={<UserOutlined />} />
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Space>
  );
};

interface CardFiltersProps {
  filters: { role?: string; search?: string };
  onRoleChange: (role?: string) => void;
  onSearch: (search?: string) => void;
}

const CardFilters: React.FC<CardFiltersProps> = ({ filters, onRoleChange, onSearch }) => {
  const [searchValue, setSearchValue] = useState(filters.search ?? '');

  useEffect(() => {
    setSearchValue(filters.search ?? '');
  }, [filters.search]);

  return (
    <div className="bg-white rounded-lg border p-4">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space direction="horizontal" size="large" wrap>
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Role</div>
            <Select
              allowClear
              placeholder="Filter by role"
              style={{ width: 200 }}
              value={filters.role}
              onChange={onRoleChange}
            >
              {roleOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Search</div>
            <Input
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              style={{ width: 320 }}
              allowClear
              value={searchValue}
              onChange={(event) => {
                const value = event.target.value;
                setSearchValue(value);
                if (!value) {
                  onSearch(undefined);
                }
              }}
              onPressEnter={(event) => onSearch((event.target as HTMLInputElement).value || undefined)}
              onBlur={(event) => onSearch((event.target as HTMLInputElement).value || undefined)}
            />
          </div>
        </Space>
      </Space>
    </div>
  );
};

export default UsersPage;
