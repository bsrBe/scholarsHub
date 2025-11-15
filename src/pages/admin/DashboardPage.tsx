// Update DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Spin, 
  Typography, 
  Button,
  Avatar,
  Space,
  message,
  List,
  Badge
} from 'antd';  
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  ArrowRightOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import adminService from '../../services/adminService';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface Meeting {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  participants: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalMeetings: number;
  activeMeetings: number;
  systemStatus: 'healthy' | 'degraded' | 'maintenance';
}

import { ActivityItem as AdminActivityItem } from '../../services/adminService';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'maintenance'>('healthy');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Using available methods from adminService
        const [statsData, recentActivities, recentUsersData] = await Promise.all([
          adminService.getStats(),
          adminService.getRecentActivities(5), // Get 5 most recent activities
          adminService.getUsers({ limit: 5, page: 1 }) // Get first 5 most recent users
        ]);
        
        // Transform activities to meetings format
        const recentMeetingsData = recentActivities
          .filter((activity: AdminActivityItem) => activity.entityType === 'meeting')
          .map((activity: AdminActivityItem) => ({
            _id: activity.entityId,
            title: activity.action.replace(/^[a-z]/, (c) => c.toUpperCase()) || 'Meeting',
            startTime: activity.createdAt,
            endTime: new Date(new Date(activity.createdAt).getTime() + 3600000).toISOString(),
            status: activity.metadata?.status || 'scheduled',
            participants: activity.actor ? [{
              _id: activity.actor._id,
              name: activity.actor.name,
              email: activity.actor.email
            }] : []
          }));
        
        setStats({
          totalUsers: statsData.totals.users,
          totalMeetings: statsData.totals.meetings,
          activeMeetings: statsData.meetingsByStatus.scheduled,
          systemStatus: 'healthy' // You might want to add system status to your stats
        });
        
        setRecentMeetings(recentMeetingsData);
        setRecentUsers(recentUsersData.items);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      scheduled: { color: 'blue', text: 'Scheduled' },
      ongoing: { color: 'green', text: 'Ongoing' },
      completed: { color: 'default', text: 'Completed' },
      cancelled: { color: 'red', text: 'Cancelled' },
      healthy: { color: 'green', text: 'Healthy' },
      degraded: { color: 'orange', text: 'Degraded' },
      maintenance: { color: 'purple', text: 'Maintenance' }
    };

    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Meeting) => (
        <Link to={`/admin/meetings/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'startTime',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM D, YYYY hh:mm A'),
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants: Meeting['participants']) => (
        <Avatar.Group maxCount={3}>
          {participants.map((p, i) => (
            <Avatar key={i} icon={<UserOutlined />} />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Meeting) => (
        <Space size="middle">
          {record.status === 'scheduled' && (
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleStartMeeting(record._id)}
            >
              Start
            </Button>
          )}
          {record.status === 'ongoing' && (
            <Button 
              type="link" 
              icon={<ArrowRightOutlined />}
              onClick={() => handleJoinMeeting(record._id)}
            >
              Join
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleStartMeeting = (meetingId: string) => {
    // Implement start meeting logic
    console.log('Start meeting:', meetingId);
  };

  const handleJoinMeeting = (meetingId: string) => {
    // Implement join meeting logic
    console.log('Join meeting:', meetingId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Title level={2}>Dashboard</Title>
        <div className="flex items-center space-x-2">
          <Badge status={systemStatus === 'healthy' ? 'success' : 'error'} />
          <span>System Status: {getStatusTag(systemStatus)}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Meetings"
              value={stats?.totalMeetings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Meetings"
              value={stats?.activeMeetings}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="System Status"
              value={systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
              valueStyle={{ 
                color: systemStatus === 'healthy' ? '#52c41a' : 
                       systemStatus === 'degraded' ? '#faad14' : '#722ed1'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Meetings */}
        <Col xs={24} xl={16}>
          <Card 
            title={
              <div className="flex justify-between items-center">
                <span>Recent Meetings</span>
                <Button 
                  type="link" 
                  icon={<ArrowRightOutlined />}
                  onClick={() => window.location.href = '/admin/meetings'}
                >
                  View All
                </Button>
              </div>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => window.location.href = '/admin/meetings/new'}
              >
                New Meeting
              </Button>
            }
          >
            <Table 
              columns={columns} 
              dataSource={recentMeetings} 
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} xl={8}>
          <Card title="Recent Activities">
            <List
              itemLayout="horizontal"
              dataSource={recentUsers.slice(0, 5)}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<a href={`/admin/users/${user._id}`}>{user.name}</a>}
                    description={`New user registered - ${dayjs(user.createdAt).fromNow()}`}
                  />
                </List.Item>
              )}
            />
            <div className="mt-4 text-center">
              <Button type="link" onClick={() => window.location.href = '/admin/users'}>
                View All Users
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="mt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                icon={<PlusOutlined />} 
                block
                onClick={() => window.location.href = '/admin/meetings/new'}
              >
                New Meeting
              </Button>
              <Button 
                icon={<TeamOutlined />} 
                block
                onClick={() => window.location.href = '/admin/users'}
              >
                Manage Users
              </Button>
              <Button 
                icon={<CalendarOutlined />} 
                block
                onClick={() => window.location.href = '/admin/meetings'}
              >
                View Calendar
              </Button>
              <Button 
                icon={<UserOutlined />} 
                block
                onClick={() => window.location.href = '/admin/users/new'}
              >
                Add User
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;