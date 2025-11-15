import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  message,
  Popconfirm,
  Modal,
  Form,
  Card,
  Typography,
  Spin,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ, FAQ } from '@/services/faqService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;

const FAQsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      message.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFaq(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    form.setFieldsValue({
      question: faq.question,
      answer: faq.answer,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFAQ(id);
      message.success('FAQ deleted successfully');
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      message.error('Failed to delete FAQ');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingFaq) {
        await updateFAQ(editingFaq._id, values);
        message.success('FAQ updated successfully');
      } else {
        await createFAQ(values);
        message.success('FAQ created successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchFAQs();
    } catch (error: any) {
      if (error?.errorFields) {
        return; // Form validation errors
      }
      console.error('Error saving FAQ:', error);
      message.error(editingFaq ? 'Failed to update FAQ' : 'Failed to create FAQ');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingFaq(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: (text: string) => (
        <div style={{ maxWidth: 400 }}>
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: (text: string) => (
        <div style={{ maxWidth: 500 }}>
          <Text ellipsis={{ tooltip: text }}>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => (value ? dayjs(value).format('MMM D, YYYY') : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: FAQ) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete FAQ"
            description="Are you sure you want to delete this FAQ?"
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button icon={<DeleteOutlined />} danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            FAQ Management
          </Title>
          <Text type="secondary">Create and manage frequently asked questions</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchFAQs} loading={loading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add FAQ
          </Button>
        </Space>
      </div>

      <Card>
        {loading && faqs.length === 0 ? (
          <div className="py-12 flex justify-center">
            <Spin size="large" />
          </div>
        ) : faqs.length === 0 ? (
          <Empty description="No FAQs yet. Create your first FAQ!" />
        ) : (
          <Table
            columns={columns}
            dataSource={faqs}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `${total} FAQs`,
            }}
          />
        )}
      </Card>

      <Modal
        title={editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingFaq ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[
              { required: true, message: 'Please enter a question' },
              { max: 500, message: 'Question must be less than 500 characters' },
            ]}
          >
            <Input placeholder="Enter the question" />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Answer"
            rules={[
              { required: true, message: 'Please enter an answer' },
              { max: 5000, message: 'Answer must be less than 5000 characters' },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Enter the answer"
              showCount
              maxLength={5000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default FAQsPage;

