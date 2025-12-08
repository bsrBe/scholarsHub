import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  message,
  Popconfirm,
  Modal,
  Form,
  Card,
  Typography,
  Spin,
  Empty,
  Image,
  Upload,
  Tag,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, BlogPost } from '@/services/blogService';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom styles for Quill editor
const quillStyles = `
  .quill-editor-container .ql-editor {
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
  }
  .quill-editor-container .ql-toolbar {
    border-top: 1px solid #d9d9d9;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
  }
  .quill-editor-container .ql-container {
    border-top: none;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    border-radius: 0 0 6px 6px;
  }
`;

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const categoryOptions = [
  { label: 'Education', value: 'education' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Applying', value: 'applying' },
  { label: 'Other', value: 'other' },
];

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
};

// Quill editor formats configuration
const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'direction', 'align',
  'link', 'image', 'video',
  'blockquote', 'code-block'
];

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogPost | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [content, setContent] = useState<string>('');

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = quillStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      message.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingArticle(null);
    form.resetFields();
    setFileList([]);
    setPreviewImage(undefined);
    setContent(''); // Reset content
    setModalVisible(true);
  };

  const handleEdit = (article: BlogPost) => {
    setEditingArticle(article);
    // Backend returns publishDate, but BlogPost interface may have publishedAt
    const publishDate = (article as any).publishDate || (article as any).publishedAt;
    form.setFieldsValue({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      featured: (article as any).featured || false,
      publishDate: publishDate ? dayjs(publishDate).format('YYYY-MM-DDTHH:mm') : undefined,
    });
    
    // Set the content state for ReactQuill
    setContent(article.content || '');
    
    if (article.thumbnail) {
      setPreviewImage(article.thumbnail);
      setFileList([{
        uid: '-1',
        name: 'thumbnail',
        status: 'done',
        url: article.thumbnail,
      }]);
    } else {
      setFileList([]);
      setPreviewImage(undefined);
    }
    
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlogPost(id);
      message.success('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      message.error('Failed to delete article');
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate content separately first
      if (!content || content.trim() === '<p><br></p>' || content.trim() === '') {
        message.error('Please enter article content');
        return;
      }
      
      // Set the content in the form field for validation
      form.setFieldsValue({ content });
      
      const values = await form.validateFields();
      
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', content); // Use the content state
      formData.append('excerpt', values.excerpt || '');
      formData.append('category', values.category || 'other');
      formData.append('readTime', values.readTime || '');
      
      if (values.featured !== undefined) {
        formData.append('featured', values.featured ? 'true' : 'false');
      }
      
      if (values.publishDate) {
        // Convert datetime-local string to ISO format
        const publishDate = values.publishDate instanceof dayjs 
          ? values.publishDate.toISOString() 
          : new Date(values.publishDate).toISOString();
        formData.append('publishDate', publishDate);
      }
      
      // Add thumbnail if a new file was uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('thumbnail', fileList[0].originFileObj);
      }
      
      if (editingArticle) {
        await updateBlogPost(editingArticle._id, formData);
        message.success('Article updated successfully');
      } else {
        await createBlogPost(formData);
        message.success('Article created successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setPreviewImage(undefined);
      setContent(''); // Reset content
      fetchArticles();
    } catch (error: any) {
      if (error?.errorFields) {
        return; // Form validation errors
      }
      console.error('Error saving article:', error);
      message.error(editingArticle ? 'Failed to update article' : 'Failed to create article');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingArticle(null);
    form.resetFields();
    setFileList([]);
    setPreviewImage(undefined);
    setContent(''); // Reset content
  };

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];
    
    // Limit to 1 file
    newFileList = newFileList.slice(-1);
    
    // Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    
    setFileList(newFileList);
    
    // Set preview if file is uploaded
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else if (newFileList.length === 0) {
      setPreviewImage(undefined);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (url: string) => (
        url ? (
          <Image
            src={url}
            alt="Thumbnail"
            width={60}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
        ) : (
          <div style={{ width: 60, height: 40, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text type="secondary" style={{ fontSize: 10 }}>No image</Text>
          </div>
        )
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <div style={{ maxWidth: 300 }}>
          <Text strong ellipsis={{ tooltip: text }}>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category || 'other'}</Tag>
      ),
    },
    {
      title: 'Excerpt',
      dataIndex: 'excerpt',
      key: 'excerpt',
      render: (text: string) => (
        <div style={{ maxWidth: 300 }}>
          <Text ellipsis={{ tooltip: text }}>{text || '—'}</Text>
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
      width: 180,
      render: (_: any, record: BlogPost) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Article"
            description="Are you sure you want to delete this article?"
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
            Article Management
          </Title>
          <Text type="secondary">Create and manage blog articles and content</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchArticles} loading={loading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Article
          </Button>
        </Space>
      </div>

      <Card>
        {loading && articles.length === 0 ? (
          <div className="py-12 flex justify-center">
            <Spin size="large" />
          </div>
        ) : articles.length === 0 ? (
          <Empty description="No articles yet. Create your first article!" />
        ) : (
          <Table
            columns={columns}
            dataSource={articles}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `${total} articles`,
            }}
          />
        )}
      </Card>

      <Modal
        title={editingArticle ? 'Edit Article' : 'Create New Article'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingArticle ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={800}
        destroyOnClose
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{
            category: 'other',
            featured: false,
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Please enter a title' },
              { max: 200, message: 'Title must be less than 200 characters' },
            ]}
          >
            <Input placeholder="Enter article title" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Excerpt"
            rules={[
              { max: 500, message: 'Excerpt must be less than 500 characters' },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Enter a brief excerpt (optional)"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            hidden
          >
            <Input />
          </Form.Item>
          
          <Form.Item label="Content" required>
            <div className="quill-editor-container">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your article content here..."
                style={{ minHeight: '300px' }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {categoryOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="readTime"
            label="Read Time (e.g., '5 min read')"
          >
            <Input placeholder="Enter estimated read time" />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Thumbnail Image"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {previewImage && (
              <div style={{ marginTop: 8 }}>
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={200}
                  style={{ borderRadius: 4 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="publishDate"
            label="Publish Date"
          >
            <Input
              type="datetime-local"
              placeholder="Select publish date (optional)"
            />
          </Form.Item>

          <Form.Item
            name="featured"
            valuePropName="checked"
            label="Featured Article"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default ArticlesPage;

