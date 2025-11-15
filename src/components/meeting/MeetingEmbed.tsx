import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import useAuth from '@/hooks/useAuth';
import { jitsiService } from '@/services/jitsiService';

interface MeetingEmbedProps {
  meetingId: string;
  displayName: string;
  onClose: () => void;
}

const MeetingEmbed = ({ meetingId, displayName, onClose }: MeetingEmbedProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jitsiConfig, setJitsiConfig] = useState<any>(null);

  // Load Jitsi configuration
  useEffect(() => {
    const initializeMeeting = async () => {
      try {
        setLoading(true);
        const config = await jitsiService.getJitsiConfig();
        setJitsiConfig(config);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing meeting:', error);
        setError('Failed to initialize the meeting. Please try again.');
        setLoading(false);
      }
    };

    initializeMeeting();
  }, [meetingId]);

  const handleApiReady = (api: any) => {
    try {
      setLoading(false);
      
      api.addListener('readyToClose', () => {
        onClose();
      });
      
      // Handle any errors that might occur after initialization
      api.addListener('errorOccurred', (error: any) => {
        console.error('Jitsi meeting error:', error);
        
        // Handle specific error cases
        if (error?.error?.recoverable) {
          console.warn('Recoverable Jitsi error:', error);
          return;
        }
        
        setError('An error occurred while joining the meeting. Please try again.');
        setLoading(false);
      });
      
      return () => {
        api.dispose();
      };
    } catch (error) {
      console.error('Error initializing Jitsi meeting:', error);
      setError('Failed to initialize the meeting. Please try again.');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Meeting Error</h2>
          <p className="text-gray-700 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-semibold">Meeting Room</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close meeting"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-white">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p>Loading meeting room...</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="flex-1">
          <JitsiMeeting
            roomName={meetingId}
            configOverwrite={{
              ...jitsiConfig?.config,
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              enableWelcomePage: false,
              disableModeratorIndicator: true,
              startAudioOnly: false,
              enableNoAudioDetection: true,
              enableNoisyMicDetection: true,
              prejoinPageEnabled: false,
              disableSimulcast: false,
              enableLayerSuspension: true,
              enableEncodedTransform: true,
              enableRttStats: true,
              enableIceRestart: true,
              enableIceRestartOnError: true,
              p2p: {
                enabled: true,
                preferH264: true,
                disableH264: false,
                useStunTurn: true,
              },
              disableRtx: false,
              enableTcc: true,
              enableRemb: true,
              openBridgeChannel: true,
            }}
            interfaceConfigOverwrite={{
              ...jitsiConfig?.interfaceConfig,
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
              ]
            }}
            userInfo={{
              displayName: displayName || user?.name || 'Guest',
              email: user?.email || ''
            }}
            getIFrameRef={(iframeRef) => {
              if (iframeRef) {
                iframeRef.style.height = '100%';
                iframeRef.style.width = '100%';
                iframeRef.style.border = 'none';
              }
            }}
            onReadyToClose={onClose}
            onApiReady={handleApiReady}
          />
        </div>
      )}
    </div>
  );
};

export default MeetingEmbed;
