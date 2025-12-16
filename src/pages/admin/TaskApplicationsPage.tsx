import { useMemo, useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Input,
  Select,
  Space,
  Button,
  Card,
  Empty,
  Spin,
  Typography,
  Modal,
  Form,
  message,
  Drawer,
  Descriptions,
  Badge,
} from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, FilterOutlined, DownloadOutlined, MessageOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { taskApplicationService, TaskApplication, TaskApplicationStatus, ApplicantType } from '@/services/taskApplicationService';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const statusColorMap: Record<TaskApplicationStatus, string> = {
  pending: 'orange',
  in_review: 'blue',
  approved: 'green',
  rejected: 'red',
};

const statusOptions: Array<{ label: string; value: TaskApplicationStatus }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const applicantTypeOptions: Array<{ label: string; value: ApplicantType }> = [
  { label: 'Undergraduate', value: 'undergraduate' },
  { label: 'Masters', value: 'masters' },
  { label: 'PhD', value: 'phd' },
];

const TaskApplicationsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskApplicationStatus | undefined>();
  const [applicantType, setApplicantType] = useState<ApplicantType | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedApplication, setSelectedApplication] = useState<TaskApplication | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [focusMessages, setFocusMessages] = useState(false);
  const [responseForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Track which messages admin has read
  const ADMIN_READ_MESSAGES_KEY = 'admin_read_messages';
  const getReadMessages = (): Set<string> => {
    const stored = localStorage.getItem(ADMIN_READ_MESSAGES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };
  const [readMessages, setReadMessages] = useState<Set<string>>(() => getReadMessages());

  const queryParams = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: search || undefined,
      status,
      applicant_type: applicantType,
    }),
    [page, pageSize, search, status, applicantType]
  );

  const applicationsQuery = useQuery({
    queryKey: ['admin-task-applications', queryParams],
    queryFn: () => taskApplicationService.getAllTaskApplications(queryParams),
  });

  const applicationDetailQuery = useQuery({
    queryKey: ['task-application', selectedApplication?._id],
    queryFn: () => taskApplicationService.getTaskApplication(selectedApplication!._id),
    enabled: !!selectedApplication && drawerVisible,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: TaskApplicationStatus; response: string } }) =>
      taskApplicationService.respondToTaskApplication(id, data),
    onSuccess: () => {
      message.success('Response submitted successfully');
      setResponseModalVisible(false);
      responseForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['admin-task-applications'] });
      if (selectedApplication) {
        queryClient.invalidateQueries({ queryKey: ['task-application', selectedApplication._id] });
      }
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error || 'Failed to submit response');
    },
  });

  const addMessageMutation = useMutation({
    mutationFn: ({ id, message: msg }: { id: string; message: string }) =>
      taskApplicationService.addMessage(id, msg),
    onSuccess: () => {
      message.success('Message sent successfully');
      queryClient.invalidateQueries({ queryKey: ['task-application', selectedApplication?._id] });
      queryClient.invalidateQueries({ queryKey: ['admin-task-applications'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error || 'Failed to send message');
    },
  });

  const applications = applicationsQuery.data?.items ?? [];
  const total = applicationsQuery.data?.total ?? 0;

  // Calculate unread messages count (user messages that admin hasn't read)
  const unreadCount = useMemo(() => {
    return applications.reduce((count, app) => {
      if (!app.messages) return count;
      return count + app.messages.filter(
        (msg) => msg.from === 'user' && !readMessages.has(msg._id)
      ).length;
    }, 0);
  }, [applications, readMessages]);

  const handleTableChange = (paginationInfo: any) => {
    setPage(paginationInfo.current ?? 1);
    setPageSize(paginationInfo.pageSize ?? 10);
  };

  const resetFilters = () => {
    setSearch('');
    setStatus(undefined);
    setApplicantType(undefined);
    setPage(1);
  };

  const handleViewDetails = (application: TaskApplication) => {
    setSelectedApplication(application);
    setFocusMessages(false);
    setDrawerVisible(true);
  };

  const handleOpenMessages = (application: TaskApplication) => {
    setSelectedApplication(application);
    setFocusMessages(true);
    setDrawerVisible(true);
  };

  const handleRespond = (application: TaskApplication) => {
    setSelectedApplication(application);
    responseForm.setFieldsValue({
      status: application.status,
      response: application.admin_response || '',
    });
    setResponseModalVisible(true);
  };

  const handleSubmitResponse = (values: { status: TaskApplicationStatus; response: string }) => {
    if (!selectedApplication) return;
    respondMutation.mutate({
      id: selectedApplication._id,
      data: values,
    });
  };

  const handleSendMessage = (message: string) => {
    if (!selectedApplication) return;
    addMessageMutation.mutate({
      id: selectedApplication._id,
      message,
    });
  };

  const columns = [
    {
      title: 'Applicant',
      dataIndex: ['user_id', 'name'],
      key: 'applicant',
      render: (_: any, record: TaskApplication) => (
        <div>
          <div>{record.user_id?.name || 'Unknown User'}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.user_id?.email || 'No email'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'applicant_type',
      key: 'applicant_type',
      render: (type: ApplicantType) => (
        <Tag color="blue">{type.charAt(0).toUpperCase() + type.slice(1)}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TaskApplicationStatus) => (
        <Tag color={statusColorMap[status]}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Messages',
      key: 'messages',
      width: 100,
      render: (_: any, record: TaskApplication) => {
        const unreadInApp = record.messages?.filter(
          (msg) => msg.from === 'user' && !readMessages.has(msg._id)
        ).length || 0;
        return (
          <Space>
            <Badge count={unreadInApp} showZero={false} offset={[10, 0]}>
              <Button
                type="link"
                icon={<MessageOutlined />}
                onClick={() => handleOpenMessages(record)}
                style={{ padding: 0 }}
              >
                Chat
              </Button>
            </Badge>
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TaskApplication) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button
            icon={<MessageOutlined />}
            type="default"
            size="small"
            onClick={() => handleOpenMessages(record)}
          >
            Message
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleRespond(record)}
          >
            Respond
          </Button>
        </Space>
      ),
    },
  ];

  const fullApplication = applicationDetailQuery.data || selectedApplication;

  // Mark messages as read when drawer is opened and messages are viewed
  useEffect(() => {
    if (drawerVisible && fullApplication?.messages) {
      const newReadMessages = new Set(readMessages);
      let hasNewReads = false;

      fullApplication.messages.forEach((msg) => {
        if (msg.from === 'user' && !readMessages.has(msg._id)) {
          newReadMessages.add(msg._id);
          hasNewReads = true;
        }
      });

      if (hasNewReads) {
        setReadMessages(newReadMessages);
        localStorage.setItem(ADMIN_READ_MESSAGES_KEY, JSON.stringify(Array.from(newReadMessages)));
      }
    }
  }, [drawerVisible, fullApplication?.messages, readMessages]);

  // Auto-scroll to messages when drawer opens with focusMessages
  useEffect(() => {
    if (drawerVisible && focusMessages && selectedApplication) {
      setTimeout(() => {
        const messagesCard = document.querySelector('[data-messages-section]');
        if (messagesCard) {
          messagesCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Highlight briefly
          const card = messagesCard as HTMLElement;
          card.style.transition = 'background-color 0.3s';
          card.style.backgroundColor = '#f0f7ff';
          setTimeout(() => {
            card.style.backgroundColor = '';
          }, 2000);
        }
      }, 300);
    }
  }, [drawerVisible, focusMessages, selectedApplication]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Task Applications Management
          </Title>
          <Text type="secondary">
            Review, respond to, and manage task applications with document uploads.
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => applicationsQuery.refetch()}
            loading={applicationsQuery.isFetching}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space direction="horizontal" wrap size="large">
            <Input
              placeholder="Search by name or email"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Filter by status"
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              style={{ width: 150 }}
              allowClear
            >
              {statusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by type"
              value={applicantType}
              onChange={(value) => {
                setApplicantType(value);
                setPage(1);
              }}
              style={{ width: 150 }}
              allowClear
            >
              {applicantTypeOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
            <Button icon={<FilterOutlined />} onClick={resetFilters}>
              Reset
            </Button>
          </Space>

          {applicationsQuery.isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : applications.length === 0 ? (
            <Empty description="No task applications found" />
          ) : (
            <Table
              columns={columns}
              dataSource={applications}
              rowKey="_id"
              pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} applications`,
              }}
              onChange={handleTableChange}
            />
          )}
        </Space>
      </Card>

      <Drawer
        title={
          <Space>
            <MessageOutlined style={{ color: '#1677ff' }} />
            <span>Application Details - {fullApplication?.user_id?.name || 'Unknown User'}</span>
            {fullApplication?.messages && (() => {
              const unreadInDrawer = fullApplication.messages.filter(
                (msg: any) => msg.from === 'user' && !readMessages.has(msg._id)
              ).length;
              return unreadInDrawer > 0 ? (
                <Badge count={unreadInDrawer} showZero={false} />
              ) : null;
            })()}
          </Space>
        }
        placement="right"
        width={800}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedApplication(null);
          setFocusMessages(false);
        }}
        extra={
          <Button
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => {
              setFocusMessages(true);
              // Scroll to messages section
              setTimeout(() => {
                const messagesCard = document.querySelector('[data-messages-section]');
                messagesCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
          >
            Go to Messages
          </Button>
        }
      >
        {applicationDetailQuery.isLoading ? (
          <Spin />
        ) : fullApplication ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Applicant">
                {fullApplication.user_id?.name || 'Unknown User'} ({fullApplication.user_id?.email || 'No email'})
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color="blue">
                  {fullApplication.applicant_type.charAt(0).toUpperCase() + fullApplication.applicant_type.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColorMap[fullApplication.status]}>
                  {fullApplication.status.replace('_', ' ').toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {format(new Date(fullApplication.createdAt), 'MMM d, yyyy h:mm a')}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Documents" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(fullApplication).map(([key, value]) => {
                  if (
                    typeof value === 'string' &&
                    value.startsWith('http') &&
                    (key.includes('passport') ||
                      key.includes('certificate') ||
                      key.includes('transcript') ||
                      key.includes('recommendation') ||
                      key.includes('cv') ||
                      key.includes('resume') ||
                      key.includes('purpose') ||
                      key.includes('birth') ||
                      key.includes('proficiency') ||
                      key.includes('diploma') ||
                      key.includes('thesis') ||
                      key.includes('identity'))
                  ) {
                    return (
                      <div key={key}>
                        <Text strong style={{ textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}:
                        </Text>{' '}
                        <a href={value} target="_blank" rel="noopener noreferrer">
                          <Button icon={<DownloadOutlined />} size="small">
                            Download
                          </Button>
                        </a>
                      </div>
                    );
                  }
                  return null;
                })}
              </Space>
            </Card>

            {(fullApplication.additional_documents_pdf?.length > 0 || fullApplication.additional_documents_images?.length > 0) && (
              <Card title="Additional Documents" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {fullApplication.additional_documents_pdf?.length > 0 && (
                    <div>
                      <Text strong>Additional PDFs:</Text>
                      <Space direction="vertical" style={{ marginTop: 8, width: '100%' }}>
                        {fullApplication.additional_documents_pdf.map((url: string, index: number) => (
                          <div key={index}>
                            <Text>PDF {index + 1}:</Text>{' '}
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <Button icon={<DownloadOutlined />} size="small">
                                Download
                              </Button>
                            </a>
                          </div>
                        ))}
                      </Space>
                    </div>
                  )}
                  {fullApplication.additional_documents_images?.length > 0 && (
                    <div>
                      <Text strong>Additional Images:</Text>
                      <Space direction="vertical" style={{ marginTop: 8, width: '100%' }}>
                        {fullApplication.additional_documents_images.map((url: string, index: number) => (
                          <div key={index}>
                            <Text>Image {index + 1}:</Text>{' '}
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <Button icon={<DownloadOutlined />} size="small">
                                Download
                              </Button>
                            </a>
                          </div>
                        ))}
                      </Space>
                    </div>
                  )}
                </Space>
              </Card>
            )}

            {fullApplication.admin_response && (
              <Card title="Admin Response" size="small">
                <Text>{fullApplication.admin_response}</Text>
                {fullApplication.reviewed_at && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Reviewed on {format(new Date(fullApplication.reviewed_at), 'MMM d, yyyy')}
                    </Text>
                  </div>
                )}
              </Card>
            )}

            <Card
              data-messages-section
              title={
                <Space>
                  <MessageOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                  <Text strong style={{ fontSize: 16 }}>Messages</Text>
                  {fullApplication.messages && (() => {
                    const unreadInDrawer = fullApplication.messages.filter(
                      (msg: any) => msg.from === 'user' && !readMessages.has(msg._id)
                    ).length;
                    return unreadInDrawer > 0 ? (
                      <Badge count={unreadInDrawer} showZero={false} />
                    ) : null;
                  })()}
                </Space>
              }
              size="small"
              style={{
                border: '2px solid #1677ff',
                borderRadius: 8,
                backgroundColor: focusMessages ? '#f0f7ff' : 'transparent',
                transition: 'background-color 0.3s'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
                  {fullApplication.messages && fullApplication.messages.length > 0 ? (
                    fullApplication.messages.map((msg) => (
                      <div
                        key={msg._id}
                        style={{
                          marginBottom: 16,
                          display: 'flex',
                          justifyContent: msg.from === 'admin' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '75%',
                            padding: '12px 16px',
                            borderRadius: 12,
                            backgroundColor: msg.from === 'admin' ? '#1677ff' : '#f0f0f0',
                            color: msg.from === 'admin' ? '#fff' : '#000',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                            <Text
                              strong
                              style={{
                                color: msg.from === 'admin' ? '#fff' : '#1677ff',
                                fontSize: 13,
                                fontWeight: 600
                              }}
                            >
                              {msg.from === 'admin' ? 'You (Admin)' : msg.sent_by?.name || 'User'}
                            </Text>
                            <Text
                              style={{
                                color: msg.from === 'admin' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                                fontSize: 11,
                                marginLeft: 8
                              }}
                            >
                              {format(new Date(msg.sent_at), 'MMM d, h:mm a')}
                            </Text>
                          </div>
                          <Text style={{
                            color: msg.from === 'admin' ? '#fff' : '#000',
                            fontSize: 14,
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}>
                            {msg.message}
                          </Text>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                      <MessageOutlined style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }} />
                      <Text type="secondary">No messages yet. Start the conversation!</Text>
                    </div>
                  )}
                </div>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Type a message to the applicant..."
                    onPressEnter={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) {
                        handleSendMessage(value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    style={{ borderRadius: '6px 0 0 6px' }}
                  />
                  <Button
                    type="primary"
                    icon={<MessageOutlined />}
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      if (input && input.value.trim()) {
                        handleSendMessage(input.value);
                        input.value = '';
                      }
                    }}
                    style={{ borderRadius: '0 6px 6px 0' }}
                  >
                    Send
                  </Button>
                </Space.Compact>
              </Space>
            </Card>

            <Button
              type="primary"
              block
              onClick={() => handleRespond(fullApplication)}
            >
              Respond to Application
            </Button>
          </Space>
        ) : null}
      </Drawer>

      <Modal
        title="Respond to Application"
        open={responseModalVisible}
        onCancel={() => {
          setResponseModalVisible(false);
          responseForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={responseForm}
          layout="vertical"
          onFinish={handleSubmitResponse}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              {statusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="response"
            label="Response"
            rules={[{ required: true, message: 'Please enter a response' }]}
          >
            <TextArea rows={6} placeholder="Enter your response to the applicant..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={respondMutation.isPending}
              >
                Submit Response
              </Button>
              <Button onClick={() => setResponseModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default TaskApplicationsPage;

