// Admin Testimonial Management Page
import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Input,
    Form,
    Modal,
    Upload,
    message,
    Popconfirm,
    Tag,
    Switch,
    Spin,
    Empty,
    Image,
    Select,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import {
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialStatus,
    Testimonial,
} from '@/services/testimonialService';
import imageCompression from 'browser-image-compression';

const TestimonialPage: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getAllTestimonials();
            setTestimonials(data);
        } catch (err) {
            console.error(err);
            message.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = () => {
        setEditing(null);
        form.resetFields();
        setFileList([]);
        setPreviewImage(undefined);
        setModalVisible(true);
    };

    const handleEdit = (record: Testimonial) => {
        setEditing(record);
        form.setFieldsValue({
            name: record.name,
            country: record.country,
            university: record.university,
            message: record.message,
            rating: record.rating,
            isActive: record.isActive,
        });
        if (record.image?.url) {
            setPreviewImage(record.image.url);
            setFileList([
                {
                    uid: '-1',
                    name: 'image',
                    status: 'done',
                    url: record.image.url,
                },
            ]);
        } else {
            setFileList([]);
            setPreviewImage(undefined);
        }
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTestimonial(id);
            message.success('Deleted');
            fetchData();
        } catch (err) {
            console.error(err);
            message.error('Delete failed');
        }
    };

    const handleToggle = async (record: Testimonial) => {
        try {
            await toggleTestimonialStatus(record._id);
            message.success('Status updated');
            fetchData();
        } catch (err) {
            console.error(err);
            message.error('Failed to update status');
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Only image files allowed');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be <5MB');
            return Upload.LIST_IGNORE;
        }
        return false; // prevent auto upload
    };

    const handleFileChange = (info: any) => {
        let newList = [...info.fileList];
        newList = newList.slice(-1);
        setFileList(newList);
        if (newList.length > 0 && newList[0].originFileObj) {
            const reader = new FileReader();
            reader.onload = e => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(newList[0].originFileObj);
        } else {
            setPreviewImage(undefined);
        }
    };

    const [submitting, setSubmitting] = useState(false);



    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('country', values.country);
            formData.append('university', values.university);
            formData.append('message', values.message);
            formData.append('rating', values.rating?.toString() ?? '0');
            formData.append('isActive', values.isActive ? 'true' : 'false');
            if (fileList.length > 0 && fileList[0].originFileObj) {
                const file = fileList[0].originFileObj;
                console.log(`Original file size: ${file.size / 1024 / 1024} MB`);

                const options = {
                    maxSizeMB: 0.8, // Compress to ~800KB
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                try {
                    const compressedFile = await imageCompression(file, options);
                    console.log(`Compressed file size: ${compressedFile.size / 1024 / 1024} MB`);
                    console.log(`Appending file to FormData: ${file.name}`);
                    formData.append('image', compressedFile, file.name);
                } catch (error) {
                    console.error("Image compression failed:", error);
                    formData.append('image', file); // Fallback
                }
            } else if (editing && editing.image?.url && fileList.length === 0) {
                // Image was removed
                formData.append('removeImage', 'true');
            }
            if (editing) {
                await updateTestimonial(editing._id, formData);
                message.success('Updated');
            } else {
                await createTestimonial(formData);
                message.success('Created');
            }
            setModalVisible(false);
            fetchData();
        } catch (err) {
            console.error(err);
            message.error('Save failed');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (img: any) =>
                img?.url ? (
                    <Image src={img.url} width={60} height={40} style={{ objectFit: 'cover' }} preview={false} />
                ) : (
                    <Tag color="default">No Image</Tag>
                ),
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Country', dataIndex: 'country', key: 'country' },
        { title: 'University', dataIndex: 'university', key: 'university' },
        { title: 'Rating', dataIndex: 'rating', key: 'rating' },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean, rec: Testimonial) => (
                <Switch checked={active} onChange={() => handleToggle(rec)} />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, rec: Testimonial) => (
                <Space>
                    <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(rec)} />
                    <Popconfirm
                        title="Delete?"
                        onConfirm={() => handleDelete(rec._id)}
                        okText="Delete"
                        cancelText="Cancel"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button icon={<DeleteOutlined />} danger type="link" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Add Testimonial
                </Button>
            </Space>
            {loading ? (
                <Spin />
            ) : testimonials.length === 0 ? (
                <Empty description="No testimonials yet" />
            ) : (
                <Table dataSource={testimonials} columns={columns} rowKey="_id" />
            )}
            <Modal
                title={editing ? 'Edit Testimonial' : 'Create Testimonial'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                okText={editing ? 'Update' : 'Create'}
                confirmLoading={submitting}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="university" label="University" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value={1}>1 Star</Select.Option>
                                <Select.Option value={2}>2 Stars</Select.Option>
                                <Select.Option value={3}>3 Stars</Select.Option>
                                <Select.Option value={4}>4 Stars</Select.Option>
                                <Select.Option value={5}>5 Stars</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="isActive" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Image">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onChange={handleFileChange}
                            maxCount={1}
                            accept="image/*"
                        >
                            {fileList.length < 1 && <UploadOutlined />}
                        </Upload>
                        {previewImage && (
                            <Image src={previewImage} width={200} style={{ marginTop: 8, borderRadius: 4 }} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default TestimonialPage;
