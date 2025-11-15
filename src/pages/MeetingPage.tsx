import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MeetingService } from '@/services/meetingService';
import { Loader2, X } from 'lucide-react';

// Jitsi Meet API type
type JitsiMeetExternalApi = {
  dispose: () => void;
  executeCommand: (command: string, ...args: any[]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
};

interface MeetingInfo {
  id: string;
  title?: string;
  startTime: string;
  status: string;
}

const MeetingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Video Meeting | ScholarsHub';

    // Create script element for Jitsi Meet API
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/vpaas-magic-cookie-016384bdf9444c6795aaf6aadb640f8b/external_api.js';
    script.async = true;

    const initializeJitsi = async () => {
      if (!containerRef.current) return null;

      try {
        // Get room ID from URL or use a default one
        const roomId = searchParams.get('id') || 'default-room';
        
        // You can add validation or fetch meeting details here
        const canJoin = MeetingService.canJoinMeeting(new Date().toISOString());
        if (!canJoin.canJoin) {
          setError(canJoin.message);
          setIsLoading(false);
          return null;
        }

        const api = new window.JitsiMeetExternalAPI("8x8.vc", {
          roomName: `vpaas-magic-cookie-016384bdf9444c6795aaf6aadb640f8b/${roomId}`,
          parentNode: containerRef.current,
          width: '100%',
          height: '100%',
          configOverwrite: {
            disableSimulcast: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: true,
            enableClosePage: false,
            prejoinPageEnabled: true
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            DISABLE_VIDEO_BACKGROUND: false,
            HIDE_INVITE_MORE_HEADER: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
              'security'
            ]
          }
        });

        api.executeCommand('displayName', 'Participant');
        
        api.on('readyToClose', () => {
          setMeetingEnded(true);
        });

        api.on('videoConferenceLeft', () => {
          setMeetingEnded(true);
        });

        api.on('error', (err: Error) => {
          console.error('Jitsi error:', err);
          setError('Failed to initialize the meeting. Please try again.');
        });

        setIsLoading(false);
        return api;
      } catch (error) {
        console.error('Failed to initialize Jitsi Meet:', error);
        setError('Failed to initialize the meeting. Please refresh the page and try again.');
        setIsLoading(false);
        return null;
      }
    };

    script.onload = () => {
      const timeout = setTimeout(() => {
        if (isLoading) {
          setError('Meeting is taking longer than expected to load. Please check your connection.');
          setIsLoading(false);
        }
      }, 15000);

      initializeJitsi().then(api => {
        clearTimeout(timeout);
        return () => {
          if (api) {
            api.dispose();
          }
        };
      });
    };

    script.onerror = (error) => {
      console.error('Failed to load Jitsi Meet API:', error);
      setError('Failed to load the meeting interface. Please check your connection and refresh the page.');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [searchParams]);

  if (meetingEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Meeting Ended</h1>
          <p className="mb-6">The meeting has ended. You can close this window or return to the dashboard.</p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Meeting Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading meeting...</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default MeetingPage;
