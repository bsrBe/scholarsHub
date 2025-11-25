import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
  Spin,
  Tooltip,
  Empty,
  Modal,
  Typography,
  Space,
  message,
  Upload,
  Drawer,
} from 'antd';
import {
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  UserOutlined,
  BuildOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface PartnershipRequest {
  id: string;
  type: 'individual' | 'company';
  fullName?: string;
  organizationName?: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  profession?: string;
  organizationType?: string;
  country: string;
  website?: string;
  message?: string;
  expertise?: string[];
  partnershipInterest?: string[];
  documents?: {
    type: string;
    filename: string;
    originalName: string;
    path: string;
    size: number;
    public_id?: string;
    url?: string;
  }[];
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

const apiBaseURL = process.env.VITE_API_BASE_URL;

const PartnershipRequestsPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const queryClient = useQueryClient();

  // Fetch partnership requests
  const { data: requestsData, isLoading, error } = useQuery({
    queryKey: ['partnership-requests'],
    queryFn: async () => {
      const response = await fetch(`${apiBaseURL}/partners-contact/requests`);
      if (!response.ok) {
        throw new Error('Failed to fetch partnership requests');
      }
      const result = await response.json();
      return result.data || [];
    },
  });

  // Download file mutation
  const downloadFile = async (filename: string, originalName: string) => {
    try {
      // Use the full public_id as stored in the database, URL encoded
      const encodedFilename = encodeURIComponent(filename);
      const response = await fetch(`${apiBaseURL}/partners-contact/download/${encodedFilename}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download file');
    }
  };

  const columns: ColumnsType<PartnershipRequest> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'individual' ? 'blue' : 'green'} icon={type === 'individual' ? <UserOutlined /> : <BuildOutlined />}>
          {type === 'individual' ? 'Individual' : 'Company'}
        </Tag>
      ),
    },
    {
      title: 'Name/Organization',
      key: 'name',
      render: (record: PartnershipRequest) => (
        <div>
          <Text strong>
            {record.type === 'individual' ? record.fullName : record.organizationName}
          </Text>
          {record.type === 'company' && record.contactPerson && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Contact: {record.contactPerson}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Text copyable>{email}</Text>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Documents',
      key: 'documents',
      render: (record: PartnershipRequest) => (
        <Space>
          {record.documents && record.documents.length > 0 ? (
            <>
              <Tag icon={<FileTextOutlined />} color="default">
                {record.documents.length} file(s)
              </Tag>
              <Tooltip title="View Documents">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setSelectedRequest(record);
                    setDetailDrawerVisible(true);
                  }}
                />
              </Tooltip>
            </>
          ) : (
            <Tag color="default">No documents</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: PartnershipRequest) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRequest(record);
                setDetailDrawerVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Empty description="Failed to load partnership requests" />
      </div>
    );
  }

  const requests = requestsData || [];

  return (
    <div>
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={24}>
          <Card>
            <Title level={2}>Partnership Requests</Title>
            <Paragraph type="secondary">
              View and manage partnership inquiries from individuals and companies.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Table
              columns={columns}
              dataSource={requests}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`,
              }}
              locale={{
                emptyText: <Empty description="No partnership requests found" />,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Detail Drawer */}
      <Drawer
        title="Partnership Request Details"
        placement="right"
        size="large"
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedRequest(null);
        }}
        open={detailDrawerVisible}
      >
        {selectedRequest && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Basic Information */}
            <Card title="Basic Information" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Type: </Text>
                  <Tag color={selectedRequest.type === 'individual' ? 'blue' : 'green'}>
                    {selectedRequest.type === 'individual' ? 'Individual' : 'Company'}
                  </Tag>
                </div>

                {selectedRequest.type === 'individual' ? (
                  <>
                    <div>
                      <Text strong>Full Name: </Text>
                      <Text>{selectedRequest.fullName}</Text>
                    </div>
                    <div>
                      <Text strong>Profession: </Text>
                      <Text>{selectedRequest.profession}</Text>
                    </div>
                    {selectedRequest.expertise && selectedRequest.expertise.length > 0 && (
                      <div>
                        <Text strong>Areas of Expertise: </Text>
                        <div className="mt-1">
                          {selectedRequest.expertise.map((skill, index) => (
                            <Tag key={index} color="blue" className="mb-1">
                              {skill}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <Text strong>Organization: </Text>
                      <Text>{selectedRequest.organizationName}</Text>
                    </div>
                    <div>
                      <Text strong>Contact Person: </Text>
                      <Text>{selectedRequest.contactPerson}</Text>
                    </div>
                    <div>
                      <Text strong>Organization Type: </Text>
                      <Text>{selectedRequest.organizationType}</Text>
                    </div>
                    {selectedRequest.website && (
                      <div>
                        <Text strong>Website: </Text>
                        <a href={selectedRequest.website} target="_blank" rel="noopener noreferrer">
                          {selectedRequest.website}
                        </a>
                      </div>
                    )}
                    {selectedRequest.partnershipInterest && selectedRequest.partnershipInterest.length > 0 && (
                      <div>
                        <Text strong>Partnership Interests: </Text>
                        <div className="mt-1">
                          {selectedRequest.partnershipInterest.map((interest, index) => (
                            <Tag key={index} color="green" className="mb-1">
                              {interest}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <Text strong>Email: </Text>
                  <Text copyable>{selectedRequest.email}</Text>
                </div>

                {selectedRequest.phone && (
                  <div>
                    <Text strong>Phone: </Text>
                    <Text>{selectedRequest.phone}</Text>
                  </div>
                )}

                <div>
                  <Text strong>Country: </Text>
                  <Text>{selectedRequest.country}</Text>
                </div>

                <div>
                  <Text strong>Submitted: </Text>
                  <Text>{new Date(selectedRequest.submittedAt).toLocaleString()}</Text>
                </div>
              </Space>
            </Card>

            {/* Message */}
            {selectedRequest.message && (
              <Card title="Message" size="small">
                <Paragraph>{selectedRequest.message}</Paragraph>
              </Card>
            )}

            {/* Documents */}
            {selectedRequest.documents && selectedRequest.documents.length > 0 && (
              <Card title="Uploaded Documents" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {selectedRequest.documents?.map((doc) => (
                    <div key={doc.public_id || doc.filename} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <Text strong>{doc.type}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {doc.originalName} ({(doc.size / 1024).toFixed(2)} KB)
                        </Text>
                      </div>
                      <Button
                        type="primary"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => downloadFile(doc.public_id || doc.filename, doc.originalName)}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </Space>
              </Card>
            )}
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default PartnershipRequestsPage;
