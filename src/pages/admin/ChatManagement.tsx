import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Input,
  Button,
  Avatar,
  Typography,
  Space,
  Spin,
  Empty,
  Tag,
  List,
  Divider,
  message,
  Badge,
  Tooltip,
} from 'antd';
import {
  SendOutlined,
  MessageOutlined,
  UserOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { chatService, ChatMessage } from '@/services/chatService';
import useAuth from '@/hooks/useAuth';

const { TextArea } = Input;
const { Title, Text } = Typography;

const ChatManagement = () => {
  const { user: adminUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all chat messages for admin
  const { data: allMessages, isLoading, refetch } = useQuery<ChatMessage[]>({
    queryKey: ['admin-chat-messages'],
    queryFn: () => chatService.getAllMessages(),
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Get unread count
  const { data: unreadData } = useQuery({
    queryKey: ['chat-unread-count'],
    queryFn: () => chatService.getUnreadCount(),
    refetchInterval: 5000,
  });

  // Send message mutation
  const { mutate: sendMessage, isPending: sendingMessage } = useMutation({
    mutationFn: ({ message, userId }: { message: string; userId: string }) =>
      chatService.adminSendMessage(message, userId),
    onSuccess: () => {
      setMessageInput('');
      setReplyTo(null);
      refetch();
      message.success('Message sent successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to send message');
    },
  });

  // Mark as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: (messageIds: string[]) => chatService.markAsRead(messageIds),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['chat-unread-count'] });
    },
  });

  // Group messages by user
  const messagesByUser = allMessages?.reduce((acc, msg) => {
    if (!acc[msg.userId]) {
      acc[msg.userId] = [];
    }
    acc[msg.userId].push(msg);
    return acc;
  }, {} as Record<string, ChatMessage[]>) || {};

  // Get unique users with their latest message
  const userConversations = Object.entries(messagesByUser)
    .map(([userId, messages]) => {
      const latestMessage = messages.sort((a, b) => 
        new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
      )[0];
      const user = latestMessage.user;
      const unreadCount = messages.filter(m => m.from === 'user' && !m.read_at).length;
      
      return {
        userId,
        user,
        latestMessage,
        unreadCount,
        allMessages: messages.sort((a, b) => 
          new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
        ),
      };
    })
    .sort((a, b) => new Date(b.latestMessage.sent_at).getTime() - new Date(a.latestMessage.sent_at).getTime());

  const selectedConversation = userConversations.find(conv => conv.userId === selectedUser);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (selectedUser && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.allMessages, selectedUser]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;
    
    sendMessage({
      message: messageInput.trim(),
      userId: selectedUser,
    });
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUser(userId);
    setReplyTo(null);
    
    // Mark unread messages as read
    const conversation = userConversations.find(conv => conv.userId === userId);
    if (conversation && conversation.unreadCount > 0) {
      const unreadMessageIds = conversation.allMessages
        .filter(m => m.from === 'user' && !m.read_at)
        .map(m => m._id);
      
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds);
      }
    }
  };

  const totalUnread = unreadData?.unreadCount || 0;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)', gap: 16 }}>
      {/* Conversations List */}
      <div style={{ width: 350, borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            <MessageOutlined /> Chat Messages
          </Title>
          {totalUnread > 0 && (
            <Badge count={totalUnread} style={{ backgroundColor: '#ff4d4f' }} />
          )}
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Spin />
          </div>
        ) : userConversations.length === 0 ? (
          <Empty description="No conversations yet" />
        ) : (
          <List
            dataSource={userConversations}
            renderItem={(conversation) => (
              <List.Item
                style={{
                  padding: 12,
                  borderRadius: 8,
                  cursor: 'pointer',
                  backgroundColor: selectedUser === conversation.userId ? '#f0f8ff' : 'transparent',
                  border: selectedUser === conversation.userId ? '1px solid #1890ff' : '1px solid #f0f0f0',
                  marginBottom: 8,
                }}
                onClick={() => handleSelectConversation(conversation.userId)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={conversation.user?.profileImageUrl} 
                      icon={<UserOutlined />}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{conversation.user?.name || 'Unknown User'}</Text>
                      {conversation.unreadCount > 0 && (
                        <Badge count={conversation.unreadCount} size="small" />
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {conversation.latestMessage.message.length > 30 
                          ? `${conversation.latestMessage.message.substring(0, 30)}...`
                          : conversation.latestMessage.message
                        }
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {format(new Date(conversation.latestMessage.sent_at), 'MMM d, h:mm a')}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div style={{ 
              padding: 16, 
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar 
                  src={selectedConversation.user?.profileImageUrl} 
                  icon={<UserOutlined />}
                />
                <div>
                  <Text strong>{selectedConversation.user?.name || 'Unknown User'}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedConversation.user?.email}
                  </Text>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ 
              flex: 1, 
              padding: 16, 
              overflowY: 'auto',
              backgroundColor: '#fff'
            }}>
              {selectedConversation.allMessages.map((msg) => (
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
                      maxWidth: '70%',
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: msg.from === 'admin' ? '#1890ff' : '#f0f0f0',
                      color: msg.from === 'admin' ? '#fff' : '#000',
                    }}
                  >
                    <Text style={{ color: msg.from === 'admin' ? '#fff' : '#000' }}>
                      {msg.message}
                    </Text>
                    <div style={{ 
                      marginTop: 4, 
                      fontSize: 11, 
                      opacity: 0.7,
                      color: msg.from === 'admin' ? '#fff' : '#666'
                    }}>
                      {format(new Date(msg.sent_at), 'h:mm a')}
                      {msg.from === 'admin' && (
                        <CheckOutlined style={{ marginLeft: 4 }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ 
              padding: 16, 
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fafafa'
            }}>
              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  loading={sendingMessage}
                  disabled={!messageInput.trim()}
                >
                  Send
                </Button>
              </Space.Compact>
            </div>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#fafafa'
          }}>
            <Empty description="Select a conversation to start chatting" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;
