import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  List,
  Avatar,
  Typography,
  Space,
  Button,
  Spin,
  Tooltip,
  Empty,
} from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  ProfileOutlined,
  ThunderboltOutlined,
  VideoCameraOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import adminService from '@/services/adminService';
import MeetingService from '@/services/meetingService';
import { formService } from '@/services/formService';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const statusColorMap: Record<string, string> = {
  scheduled: 'blue',
  completed: 'green',
  cancelled: 'red',
};

const formStatusColorMap: Record<string, string> = {
  pending: 'orange',
  in_review: 'blue',
  approved: 'green',
  rejected: 'red',
};

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => adminService.getOverview(),
  });

  const {
    data: meetingsData,
    isLoading: meetingsLoading,
  } = useQuery({
    queryKey: ['admin-dashboard-meetings'],
    queryFn: () => MeetingService.getAllMeetings({ limit: 5, page: 1 }),
  });

  const {
    data: usersPreview,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ['admin-dashboard-users'],
    queryFn: () => adminService.getUsers({ limit: 5, page: 1 }),
  });

  const {
    data: formDashboard,
    isLoading: formsLoading,
  } = useQuery({
    queryKey: ['admin-dashboard-forms'],
    queryFn: () => formService.getDashboardStats(),
  });

  const stats = overview?.stats;
  const activities = overview?.activities ?? [];
  const meetings = useMemo(() => {
    if (!meetingsData) return [];
    if (Array.isArray(meetingsData)) return meetingsData;
    return meetingsData.items ?? [];
  }, [meetingsData]);

  const users = useMemo(() => {
    if (!usersPreview) return [];
    if (Array.isArray(usersPreview)) return usersPreview;
    return usersPreview.items ?? [];
  }, [usersPreview]);

  const recentForms = formDashboard?.recentForms ?? [];

  const handleOpenMeetings = () => navigate('/admin/meetings');
  const handleOpenUsers = () => navigate('/admin/users');
  const handleOpenForms = () => navigate('/admin/forms');

  if (overviewLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (overviewError || !stats) {
    return (
      <Card>
        <Empty description="Failed to load dashboard data. Please try again later." />
      </Card>
    );
  }

  const meetingsByStatus = stats.meetingsByStatus ?? {
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            Admin Dashboard
          </Title>
          <Text type="secondary">Overview of platform activity and quick management actions</Text>
        </div>
        <Space>
          <Button type="default" icon={<UserOutlined />} onClick={handleOpenUsers}>
            Manage Users
          </Button>
          <Button type="primary" icon={<VideoCameraOutlined />} onClick={handleOpenMeetings}>
            Manage Meetings
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totals.users}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
            <Text type="secondary">
              +{stats.last30Days.users} in last 30 days
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Meetings"
              value={stats.totals.meetings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">
              {meetingsByStatus.scheduled} scheduled • {meetingsByStatus.completed} completed
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Submitted Forms"
              value={stats.totals.forms}
              prefix={<ProfileOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary">
              +{stats.last7Days.forms} in last 7 days
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Recent Activity"
              value={activities.length}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary">Tracked across users, meetings, forms</Text>
          </Card>
        </Col>
      </Row>

      <Card
        title="Latest Applications"
        extra={
          <Button type="link" onClick={handleOpenForms} icon={<ArrowRightOutlined />}>
            Manage forms
          </Button>
        }
      >
        {formsLoading ? (
          <Spin />
        ) : recentForms.length === 0 ? (
          <Empty description="No recent applications yet" />
        ) : (
          <Table
            dataSource={recentForms.map((form) => ({ ...form, key: form._id }))}
            pagination={false}
            columns={[
              {
                title: 'Applicant',
                dataIndex: 'full_name',
                key: 'full_name',
              },
              {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
              },
              {
                title: 'Destination',
                dataIndex: 'destination_country',
                key: 'destination_country',
                render: (value: string) => value || '—',
              },
              {
                title: 'Submitted',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (value: string) => dayjs(value).format('MMM D, YYYY'),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag color={formStatusColorMap[status] || 'default'}>
                    {status.replace('_', ' ')}
                  </Tag>
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_: any, record: any) => (
                  <Button type="link" onClick={() => navigate(`/admin/forms/${record._id}`)}>
                    View
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card
            title="Upcoming & Recent Meetings"
            extra={
              <Button type="link" onClick={handleOpenMeetings} icon={<ArrowRightOutlined />}>
                View all
              </Button>
            }
          >
            {meetingsLoading ? (
              <Spin />
            ) : meetings.length === 0 ? (
              <Empty description="No meetings scheduled yet" />
            ) : (
              <Table
                dataSource={meetings.map((meeting) => ({ ...meeting, key: meeting._id || meeting.id }))}
                pagination={false}
                columns={[
                  {
                    title: 'Title',
                    dataIndex: 'title',
                    key: 'title',
                    render: (value: string) => value || 'Consultation Meeting',
                  },
                  {
                    title: 'Host',
                    dataIndex: 'hostName',
                    key: 'hostName',
                    render: (text: string, record: any) => (
                      <div>
                        <div>{text || 'N/A'}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {record.hostEmail || ''}
                        </Text>
                      </div>
                    ),
                  },
                  {
                    title: 'Start Time',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    render: (value: string) => (
                      <div>
                        <div>{dayjs(value).format('MMM D, YYYY')}</div>
                        <Text type="secondary">{dayjs(value).format('h:mm A')}</Text>
                      </div>
                    ),
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => (
                      <Tag color={statusColorMap[status] || 'default'}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_: any, record: any) => (
                      <Space>
                        {record.jitsiMeetingLink && (
                          <Tooltip title="Open meeting in new tab">
                            <Button
                              type="link"
                              icon={<VideoCameraOutlined />}
                              onClick={() => window.open(record.jitsiMeetingLink, '_blank')}
                            >
                              Join
                            </Button>
                          </Tooltip>
                        )}
                      </Space>
                    ),
                  },
                ]}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card
              title="Recent Activities"
              extra={
                activities.length > 0 && (
                  <Text type="secondary">{dayjs(activities[0].createdAt).fromNow()}</Text>
                )
              }
            >
              {activities.length === 0 ? (
                <Empty description="No recent activities" />
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={activities}
                  renderItem={(activity) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<ThunderboltOutlined />} />}
                        title={
                          <Space direction="vertical" size={0}>
                            <Text strong>{activity.action.replace(/_/g, ' ')}</Text>
                            <Text type="secondary">{activity.entityType}</Text>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">
                              {activity.actor?.name || 'System'} • {dayjs(activity.createdAt).fromNow()}
                            </Text>
                            {activity.metadata?.title && (
                              <Text type="secondary">“{activity.metadata.title}”</Text>
                            )}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>

            <Card
              title="Newest Users"
              extra={
                <Button type="link" onClick={handleOpenUsers} icon={<ArrowRightOutlined />}>
                  View all
                </Button>
              }
            >
              {usersLoading ? (
                <Spin />
              ) : users.length === 0 ? (
                <Empty description="No users yet" />
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={users}
                  renderItem={(user) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={user.profileImageUrl} icon={<UserOutlined />} />}
                        title={
                          <Space direction="vertical" size={0}>
                            <Text strong>{user.name}</Text>
                            <Text type="secondary">{user.email}</Text>
                          </Space>
                        }
                        description={
                          <Text type="secondary">
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} •{' '}
                            {dayjs(user.createdAt).fromNow()}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Space>
        </Col>
      </Row>
    </Space>
  );
};

export default Dashboard;
