import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Send, Minimize2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { taskApplicationService, TaskApplication } from '@/services/taskApplicationService';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const LAST_VIEWED_KEY = 'chatbot_last_viewed';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get all user's task applications to aggregate messages
  // Always fetch when authenticated to show unread count even when chat is closed
  const { data: taskApplications, isLoading } = useQuery<TaskApplication[]>({
    queryKey: ['user-task-applications'],
    queryFn: () => taskApplicationService.getMyTaskApplications(),
    enabled: isAuthenticated,
    refetchInterval: isOpen ? 5000 : 30000, // Poll every 5s when open, 30s when closed
  });

  // Aggregate all messages from all applications
  const allMessages = useMemo(() => {
    return taskApplications
      ?.flatMap((app) =>
        (app.messages || []).map((msg) => ({
          ...msg,
          applicationId: app._id,
          applicationType: app.applicant_type,
        }))
      )
      .sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()) || [];
  }, [taskApplications]);

  // Get last viewed timestamp from localStorage
  const getLastViewed = (): Date => {
    const stored = localStorage.getItem(LAST_VIEWED_KEY);
    return stored ? new Date(stored) : new Date(0); // Default to epoch if not set
  };

  // Track last viewed timestamp in state to force recalculation
  const [lastViewed, setLastViewed] = useState<Date>(() => getLastViewed());

  // Calculate unread messages (admin messages sent after last viewed)
  const unreadMessages = useMemo(() => {
    if (!user) return [];
    return allMessages.filter(
      (msg) => msg.from === 'admin' && new Date(msg.sent_at) > lastViewed
    );
  }, [allMessages, user, lastViewed]);

  // Update last viewed when chat is opened and not minimized
  useEffect(() => {
    if (isOpen && !isMinimized && user) {
      const now = new Date();
      localStorage.setItem(LAST_VIEWED_KEY, now.toISOString());
      setLastViewed(now); // Update state immediately to clear unread count
    }
  }, [isOpen, isMinimized, user]);

  // Get the most recent application for sending new messages
  const mostRecentApplication = taskApplications?.[0];

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (msg: string) => {
      if (!mostRecentApplication) {
        throw new Error('No application found. Please submit a task application first.');
      }
      return taskApplicationService.addMessage(mostRecentApplication._id, msg);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Message sent successfully',
      });
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['user-task-applications'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || error.response?.data?.error || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;
    if (!isAuthenticated) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to message the admin',
        variant: 'destructive',
      });
      return;
    }
    sendMessage(message);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages, isOpen, isMinimized]);

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-5 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 group flex items-center gap-3"
          aria-label="Open chat"
        >
          <div className="relative">
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
            {unreadMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {unreadMessages.length > 99 ? '99+' : unreadMessages.length}
              </span>
            )}
          </div>
          <span className="font-semibold text-sm whitespace-nowrap">Chat with Admins</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 bg-card border-2 border-primary/20 rounded-2xl shadow-2xl transition-all duration-300',
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          )}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold">Message Admin</h3>
              {unreadMessages.length > 0 && !isMinimized && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {unreadMessages.length} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-primary-foreground/20 p-1 rounded transition-colors"
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/20 p-1 rounded transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(600px-140px)]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : allMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <MessageCircle size={48} className="mb-4 opacity-50" />
                    <p className="text-sm">
                      No messages yet. signup and Login to start a conversation with the admin!
                    </p>
                  </div>
                ) : (
                  <>
                    {allMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className={cn(
                          'flex',
                          msg.from === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] rounded-lg p-3',
                            msg.from === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(msg.sent_at), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="border-t p-4 bg-muted/30">
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        mostRecentApplication
                          ? 'Type your message...'
                          : 'Submit a task application to start messaging'
                      }
                      rows={2}
                      disabled={isPending || !mostRecentApplication}
                      className="resize-none flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (message.trim() && !isPending && mostRecentApplication) {
                            handleSubmit(e);
                          }
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={isPending || !message.trim() || !mostRecentApplication}
                      size="default"
                      className="self-end h-auto px-4 py-2"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;

