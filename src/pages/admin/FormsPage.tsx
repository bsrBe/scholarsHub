import { useMemo, useState } from 'react';
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
} from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { formService, FormStatus } from '@/services/formService';

const { Option } = Select;
const { Title, Text } = Typography;

const statusColorMap: Record<FormStatus, string> = {
  pending: 'orange',
  in_review: 'blue',
  approved: 'green',
  rejected: 'red',
};

const statusOptions: Array<{ label: string; value: FormStatus }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const FormsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FormStatus | undefined>();
  const [country, setCountry] = useState<string | undefined>();
  const [educationStatus, setEducationStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: search || undefined,
      status,
      country,
      educationStatus,
    }),
    [page, pageSize, search, status, country, educationStatus]
  );

  const formsQuery = useQuery({
    queryKey: ['admin-forms', queryParams],
    queryFn: () => formService.getForms(queryParams),
    keepPreviousData: true,
  });

  const forms = formsQuery.data?.forms ?? [];
  const pagination = formsQuery.data?.pagination;

  const handleTableChange = (paginationInfo: any) => {
    setPage(paginationInfo.current ?? 1);
    setPageSize(paginationInfo.pageSize ?? 10);
  };

  const resetFilters = () => {
    setSearch('');
    setStatus(undefined);
    setCountry(undefined);
    setEducationStatus(undefined);
    setPage(1);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Application Management
          </Title>
          <Text type="secondary">
            Review, filter, and respond to student applications submitted through the portal.
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => formsQuery.refetch()} loading={formsQuery.isFetching}>
            Refresh
          </Button>
        </Space>
      </div>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space direction="horizontal" wrap size="large">
            <Input
              allowClear
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onPressEnter={() => setPage(1)}
              onBlur={() => setPage(1)}
              placeholder="Search by name, email, or phone"
              prefix={<SearchOutlined />}
              style={{ width: 280 }}
            />
            <Select
              allowClear
              placeholder="Filter by status"
              value={status}
              style={{ width: 180 }}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Input
              allowClear
              placeholder="Destination country"
              value={country}
              onChange={(event) => setCountry(event.target.value || undefined)}
              onBlur={() => setPage(1)}
              style={{ width: 200 }}
            />
            <Input
              allowClear
              placeholder="Educational status"
              value={educationStatus}
              onChange={(event) => setEducationStatus(event.target.value || undefined)}
              onBlur={() => setPage(1)}
              style={{ width: 220 }}
            />
            <Button icon={<FilterOutlined />} onClick={resetFilters}>
              Reset filters
            </Button>
          </Space>

          {formsQuery.isLoading ? (
            <div className="py-12 flex justify-center">
              <Spin />
            </div>
          ) : forms.length === 0 ? (
            <Empty description="No applications found with the current filters." />
          ) : (
            <Table
              rowKey="_id"
              dataSource={forms}
              loading={formsQuery.isFetching}
              pagination={{
                current: pagination?.currentPage ?? page,
                pageSize,
                total: pagination?.total ?? forms.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `${total} applications`,
              }}
              onChange={handleTableChange}
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
                  title: 'Phone',
                  dataIndex: 'phone_number',
                  key: 'phone_number',
                },
                {
                  title: 'Destination',
                  dataIndex: 'destination_country',
                  key: 'destination_country',
                  render: (value: string) => value || '—',
                },
                {
                  title: 'Education',
                  dataIndex: 'educational_status',
                  key: 'educational_status',
                  render: (value: string) => value || '—',
                },
                {
                  title: 'Submitted',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  render: (value: string) => dayjs(value).format('MMM D, YYYY h:mm A'),
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (value: FormStatus) => (
                    <Tag color={statusColorMap[value] || 'default'}>
                      {value.replace('_', ' ')}
                    </Tag>
                  ),
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_: unknown, record: any) => (
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/admin/forms/${record._id}`)}
                    >
                      Review
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </Space>
      </Card>
    </Space>
  );
};

export default FormsPage;


