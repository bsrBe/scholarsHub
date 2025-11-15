import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  DatePicker,
  Select,
  Input,
  Form,
  Popconfirm,
  Tooltip,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  ReloadOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import JitsiMeeting from '@/components/meeting/JitsiMeeting';
import MeetingService from '@/services/meetingService';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const statusColorMap: Record<string, string> = {
  scheduled: 'blue',
  completed: 'green',
  cancelled: 'red',
};

const DEFAULT_TIMEZONE = 'Africa/Addis_Ababa';

const isValidationError = (err: unknown): err is { errorFields: unknown } =>
  typeof err === 'object' && err !== null && 'errorFields' in err;

interface MeetingFormValues {
  title: string;
  description?: string;
  hostName: string;
  hostEmail: string;
  participants?: string;
  timeRange: [dayjs.Dayjs, dayjs.Dayjs];
  timeZone: string;
}

interface AdminMeeting {
  _id: string;
  id?: string;
  title?: string;
  description?: string;
  hostName?: string;
  hostEmail?: string;
  participants?: string[];
  startTime: string;
  endTime: string;
  timeZone?: string;
  status: string;
  jitsiMeetingId?: string;
  jitsiMeetingLink?: string;
}

const MeetingsPage: React.FC = () => {
  const [form] = Form.useForm<MeetingFormValues>();
  const [meetings, setMeetings] = useState<AdminMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState<{
    status?: string;
    search?: string;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<AdminMeeting | null>(null);
  const [joiningMeeting, setJoiningMeeting] = useState<{ meetingId: string; displayName: string } | null>(null);

  const fetchMeetings = async (
    page = pagination.current,
    limit = pagination.pageSize,
    overrideFilters = filters
  ) => {
    try {
      setLoading(true);
      const params: {
        page: number;
        limit: number;
        status?: string;
        hostEmail?: string;
        from?: string;
        to?: string;
      } = { page, limit };
      if (overrideFilters.status) params.status = overrideFilters.status;
      if (overrideFilters.search) params.hostEmail = overrideFilters.search;
      if (overrideFilters.dateRange) {
        params.from = overrideFilters.dateRange[0].toISOString();
        params.to = overrideFilters.dateRange[1].toISOString();
      }

      const response = await MeetingService.getAllMeetings(params);
      const itemsRaw = Array.isArray(response) ? response : response.items ?? [];
      const total = Array.isArray(response) ? response.length : response.total ?? itemsRaw.length;
      const items = itemsRaw as AdminMeeting[];

      setMeetings(items);
      setPagination({
        current: Array.isArray(response) ? page : response.page ?? page,
        pageSize: Array.isArray(response) ? limit : response.limit ?? limit,
        total,
      });
    } catch (error) {
      console.error('Error fetching meetings:', error);
      message.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.search, filters.dateRange]);

  const resetModal = () => {
    form.resetFields();
    form.setFieldsValue({
      timeRange: [dayjs(), dayjs().add(1, 'hour')],
      timeZone: DEFAULT_TIMEZONE,
    });
    setEditingMeeting(null);
  };

  const openCreateModal = () => {
    resetModal();
    setModalVisible(true);
  };

  const openEditModal = (meeting: AdminMeeting) => {
    setEditingMeeting(meeting);
    form.setFieldsValue({
      title: meeting.title,
      description: meeting.description,
      hostName: meeting.hostName,
      hostEmail: meeting.hostEmail,
      participants: Array.isArray(meeting.participants) ? meeting.participants.join(', ') : '',
      timeZone: meeting.timeZone || DEFAULT_TIMEZONE,
      timeRange: [dayjs(meeting.startTime), dayjs(meeting.endTime)],
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMeeting(null);
    form.resetFields();
  };

  const submitMeeting = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.timeRange;

      const payload = {
        title: values.title,
        description: values.description,
        hostName: values.hostName,
        hostEmail: values.hostEmail,
        participants: values.participants
          ? values.participants.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        timeZone: values.timeZone || DEFAULT_TIMEZONE,
      };

      if (editingMeeting?._id) {
        await MeetingService.updateMeeting(editingMeeting._id, payload);
        message.success('Meeting updated');
      } else {
        await MeetingService.createMeeting(payload);
        message.success('Meeting scheduled');
      }

      closeModal();
      fetchMeetings();
    } catch (error: unknown) {
      if (!isValidationError(error)) {
        console.error('Error saving meeting:', error);
        message.error('Failed to save meeting');
      }
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await MeetingService.deleteMeeting(meetingId);
      message.success('Meeting deleted');
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      message.error('Failed to delete meeting');
    }
  };

  const updateStatus = async (meetingId: string, status: string) => {
    try {
      await MeetingService.updateMeeting(meetingId, { status });
      message.success(`Meeting marked as ${status}`);
      fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting status:', error);
      message.error('Failed to update status');
    }
  };

  const openJitsi = (meeting: AdminMeeting) => {
    setJoiningMeeting({
      meetingId: meeting.jitsiMeetingId || meeting.id || meeting._id,
      displayName: 'Admin',
    });
  };

  const meetingColumns: TableColumnsType<AdminMeeting> = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (value: string) => value || 'Consultation Meeting',
      },
      {
        title: 'Host',
        key: 'host',
        render: (_: unknown, record: AdminMeeting) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.hostName || 'N/A'}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.hostEmail}
            </Text>
          </Space>
        ),
      },
      {
        title: 'When',
        key: 'time',
        render: (_: unknown, record: AdminMeeting) => (
          <Space direction="vertical" size={0}>
            <Text>{dayjs(record.startTime).format('MMM D, YYYY')}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(record.startTime).format('h:mm A')} – {dayjs(record.endTime).format('h:mm A')}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Participants',
        dataIndex: 'participants',
        key: 'participants',
        render: (participants: string[]) => participants?.length ?? 0,
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
        render: (_: unknown, record: AdminMeeting) => (
          <Space>
            <Tooltip title="Edit meeting">
              <Button icon={<EditOutlined />} type="link" onClick={() => openEditModal(record)}>
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Mark completed">
              <Button
                type="link"
                onClick={() => updateStatus(record._id, 'completed')}
                disabled={record.status === 'completed'}
              >
                Complete
              </Button>
            </Tooltip>
            <Tooltip title="Join meeting room">
              <Button type="primary" icon={<VideoCameraOutlined />} onClick={() => openJitsi(record)}>
                Join
              </Button>
            </Tooltip>
            <Popconfirm
              title="Delete meeting"
              description="Are you sure you want to delete this meeting?"
              onConfirm={() => handleDeleteMeeting(record._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button danger type="link" icon={<DeleteOutlined />}>
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meeting Management</h1>
          <Text type="secondary">
            Schedule consultations, manage participants, and track meeting status
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchMeetings()}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Schedule Meeting
          </Button>
        </Space>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <Space direction="horizontal" wrap size="large">
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
            <Select
              allowClear
              placeholder="All statuses"
              style={{ width: 200 }}
              value={filters.status}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <Option value="scheduled">Scheduled</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Date range</div>
            <RangePicker
              allowClear
              showTime
              style={{ width: 320 }}
              value={filters.dateRange ?? null}
              onChange={(dates) =>
                setFilters((prev) => ({ ...prev, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] | undefined }))
              }
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Host email</div>
            <Input
              prefix={<CalendarOutlined />}
              placeholder="Filter by host email"
              style={{ width: 260 }}
              allowClear
              onChange={(event) => {
                const value = event.target.value || undefined;
                setFilters((prev) => ({ ...prev, search: value }));
              }}
            />
          </div>
        </Space>
      </div>

      <Table
        rowKey="_id"
        columns={meetingColumns}
        dataSource={meetings}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `${total} meetings`,
        }}
        onChange={(pag) => fetchMeetings(pag.current, pag.pageSize)}
      />

      <Modal
        title={editingMeeting ? 'Edit meeting' : 'Schedule meeting'}
        open={modalVisible}
        onCancel={closeModal}
        onOk={submitMeeting}
        okText={editingMeeting ? 'Save changes' : 'Create meeting'}
        destroyOnClose
      >
        <Form<MeetingFormValues> layout="vertical" form={form}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a meeting title' }]}
          >
            <Input placeholder="Consultation with student" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Provide more context about the meeting"
              rows={3}
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            name="hostName"
            label="Host name"
            rules={[{ required: true, message: 'Please enter the host name' }]}
          >
            <Input placeholder="Host full name" />
          </Form.Item>

          <Form.Item
            name="hostEmail"
            label="Host email"
            rules={[
              { required: true, message: 'Please enter the host email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input placeholder="host@email.com" />
          </Form.Item>

          <Form.Item name="participants" label="Participants">
            <Input.TextArea
              placeholder="Comma separated email addresses"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="Start & end time"
            rules={[{ required: true, message: 'Please select the meeting time range' }]}
          >
            <RangePicker showTime className="w-full" allowClear={false} />
          </Form.Item>

          <Form.Item name="timeZone" label="Time zone">
            <Input placeholder="Africa/Addis_Ababa" />
          </Form.Item>
        </Form>
      </Modal>

      {joiningMeeting && (
        <JitsiMeeting
          meetingId={joiningMeeting.meetingId}
          displayName={joiningMeeting.displayName}
          onClose={() => setJoiningMeeting(null)}
          onMeetingEnd={() => {
            setJoiningMeeting(null);
            fetchMeetings();
          }}
        />
      )}
    </div>
  );
};

export default MeetingsPage;

