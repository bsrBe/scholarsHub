// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import useAuth from '@/hooks/useAuth';
// import { Button } from '@/components/ui/button';

// // Define the JitsiMeetExternalAPI type based on the global declaration
// interface JitsiMeetExternalApi {
//   new (domain: string, options: any): JitsiMeetExternalApi;
//   dispose: () => void;
//   executeCommand: (command: string, ...args: any[]) => void;
//   on: (event: string, listener: (...args: any[]) => void) => void;
//   off: (event: string, listener: (...args: any[]) => void) => void;
//   [key: string]: any;
// }

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: new (domain: string, options: any) => JitsiMeetExternalApi;
//   }
// }

// interface JitsiMeetingProps {
//   roomName: string;
//   displayName?: string;
//   onMeetingEnd?: () => void;
//   onError?: (error: Error) => void;
//   className?: string;
//   jwt?: string;
// }

// class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('Jitsi Error Boundary:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 bg-red-100 text-red-700 rounded">
//           <h3>Something went wrong with the meeting</h3>
//           <Button 
//             onClick={() => window.location.reload()}
//             className="mt-2"
//             variant="destructive"
//           >
//             Reload
//           </Button>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// export const JitsiMeeting = ({
//   roomName,
//   displayName = 'Guest',
//   onMeetingEnd,
//   onError,
//   className = '',
//   jwt,
// }: JitsiMeetingProps) => {
//   const { user } = useAuth();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const apiRef = useRef<JitsiMeetExternalApi | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [retryCount, setRetryCount] = useState(0);

//   const initializeJitsi = useCallback(async () => {
//     if (!containerRef.current) return;

//     // Clean up previous instance if it exists
//     if (apiRef.current) {
//       apiRef.current.dispose();
//       apiRef.current = null;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // Request permissions first
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ 
//           video: true, 
//           audio: true 
//         });
//         // Stop all tracks to release them
//         stream.getTracks().forEach(track => track.stop());
//       } catch (err) {
//         console.warn('Error accessing media devices:', err);
//       }

//       // Jitsi Meet configuration
//       const jitsiConfig = {
//         disableSimulcast: false,
//         startWithAudioMuted: false,
//         startWithVideoMuted: false,
//         enableWelcomePage: false,
//         enableClosePage: false,
//         prejoinPageEnabled: true,
//         enableNoAudioDetection: true,
//         enableNoisyMicDetection: true,
//         startAudioOnly: false,
//         constraints: {
//           video: {
//             height: {
//               ideal: 720,
//               max: 720,
//               min: 240
//             }
//           }
//         }
//       };

//       // Interface configuration
//       const interfaceConfig = {
//         DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
//         DISABLE_VIDEO_BACKGROUND: false,
//         HIDE_INVITE_MORE_HEADER: true,
//         SHOW_JITSI_WATERMARK: false,
//         SHOW_WATERMARK_FOR_GUESTS: false,
//         SHOW_BRAND_WATERMARK: false,
//         TOOLBAR_BUTTONS: [
//           'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
//           'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
//           'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
//           'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
//           'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
//           'security'
//         ]
//       };

//       // Initialize Jitsi Meet API
//       // Use type assertion to handle the global JitsiMeetExternalAPI
//       const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI as any;
//       apiRef.current = new JitsiMeetExternalAPI('8x8.vc', {
//         roomName: `vpaas-magic-cookie-016384bdf9444c6795aaf6aadb640f8b/${roomName}`,
//         parentNode: containerRef.current,
//         configOverwrite: jitsiConfig,
//         interfaceConfigOverwrite: interfaceConfig,
//         userInfo: {
//           displayName: user?.name || displayName,
//           email: user?.email,
//         },
//         jwt: jwt
//       });

//       // Event handlers
//       apiRef.current.on('readyToClose', () => {
//         if (onMeetingEnd) onMeetingEnd();
//         apiRef.current?.dispose();
//       });

//       apiRef.current.on('videoConferenceJoined', () => {
//         console.log('Joined meeting:', roomName);
//         setIsLoading(false);
//       });

//       apiRef.current.on('videoConferenceLeft', () => {
//         console.log('Left meeting:', roomName);
//         if (onMeetingEnd) onMeetingEnd();
//       });

//       apiRef.current.on('error', (err: Error) => {
//         console.error('Jitsi meeting error:', err);
//         setError(err.message || 'An error occurred while initializing the meeting');
//         setIsLoading(false);
//         if (onError) onError(err);
//       });

//       // Set a timeout to handle cases where the meeting doesn't start
//       const timeout = setTimeout(() => {
//         if (isLoading) {
//           console.warn('Meeting initialization is taking longer than expected');
//           setIsLoading(false);
//         }
//       }, 10000);

//       return () => clearTimeout(timeout);

//     } catch (err) {
//       const error = err as Error;
//       console.error('Failed to initialize Jitsi Meet:', error);
//       setError(error.message || 'Failed to initialize meeting');
//       setIsLoading(false);
//       if (onError) onError(error);
//     }
//   }, [roomName, user, displayName, onMeetingEnd, onError, jwt]);

//   // Initialize Jitsi when component mounts or retry count changes
//   useEffect(() => {
//     const init = async () => {
//       await initializeJitsi();
//     };
    
//     init();
    
//     // Cleanup function
//     return () => {
//       if (apiRef.current) {
//         console.log('Cleaning up Jitsi Meet instance');
//         apiRef.current.dispose();
//         apiRef.current = null;
//       }
//     };
//   }, [initializeJitsi]);

//   // Handle retry
//   const handleRetry = useCallback(() => {
//     setRetryCount(prev => prev + 1);
//   }, []);

//   // Retry logic with exponential backoff
//   useEffect(() => {
//     if (retryCount > 0 && retryCount <= 3) {
//       const timer = setTimeout(() => {
//         console.log(`Retrying Jitsi initialization (attempt ${retryCount})`);
//         initializeJitsi();
//       }, 1000 * retryCount);
      
//       return () => clearTimeout(timer);
//     }
//   }, [retryCount, initializeJitsi]);

//   return (
//     <ErrorBoundary>
//       <div className="relative w-full h-full">
//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
//             <div className="text-center p-6 bg-white rounded-lg shadow-lg">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-700">Initializing meeting...</p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
//             <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
//               <div className="text-red-500 text-4xl mb-4">⚠️</div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting Error</h3>
//               <p className="text-gray-700 mb-4">{error}</p>
//               <div className="flex justify-center space-x-4">
//                 <Button 
//                   onClick={handleRetry}
//                   className="bg-blue-500 hover:bg-blue-600 text-white"
//                   disabled={retryCount >= 3}
//                 >
//                   {retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
//                 </Button>
//                 <Button 
//                   variant="outline" 
//                   onClick={() => onMeetingEnd?.()}
//                 >
//                   Leave Meeting
//                 </Button>
//               </div>
//               {retryCount > 0 && (
//                 <p className="text-sm text-gray-500 mt-2">
//                   Attempt {Math.min(retryCount, 3)} of 3
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         <div 
//           ref={containerRef}
//           className={`jitsi-container ${className}`}
//           style={{ 
//             width: '100%', 
//             height: '100%', 
//             minHeight: '500px',
//             backgroundColor: '#1c2025' 
//           }}
//         />
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default JitsiMeeting;









import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, X } from 'lucide-react';
import { completeMeeting } from '@/services/meetingService';

interface JitsiMeetingProps {
  meetingId: string;
  displayName: string;
  onClose: () => void;
  onMeetingEnd?: (meetingId: string) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: any) => any;
  }
}

export const JitsiMeeting = ({ meetingId, displayName, onClose, onMeetingEnd }: JitsiMeetingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiRef = useRef<any>(null);

  const handleClose = useCallback(async () => {
    try {
      await completeMeeting(meetingId);
      if (onMeetingEnd) {
        onMeetingEnd(meetingId);
      }
    } catch (error) {
      console.error('Failed to complete meeting:', error);
    } finally {
      onClose();
    }
  }, [meetingId, onClose, onMeetingEnd]);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://8x8.vc/vpaas-magic-cookie-016384bdf9444c6795aaf6aadb640f8b/external_api.js';
    script.async = true;

    const initializeJitsi = () => {
      if (!containerRef.current) return;

      try {
        const api = new window.JitsiMeetExternalAPI("8x8.vc", {
          roomName: `vpaas-magic-cookie-016384bdf9444c6795aaf6aadb640f8b/${meetingId}`,
          parentNode: containerRef.current,
          width: '100%',
          height: '100%',
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: true,
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
          userInfo: {
            displayName,
          },
        });

        apiRef.current = api;

        const handleConferenceLeft = () => {
          handleClose();
        };

        api.on('videoConferenceLeft', handleConferenceLeft);
        api.on('readyToClose', handleConferenceLeft);

        setIsLoading(false);

        return () => {
          api.dispose();
        };
      } catch (error) {
        console.error('Failed to initialize Jitsi:', error);
        handleClose();
      }
    };

    script.onload = initializeJitsi;
    script.onerror = () => {
      console.error('Failed to load Jitsi script');
      handleClose();
    };

    document.body.appendChild(script);

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [meetingId, displayName, handleClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Meeting Room: {meetingId}</h2>
        <button
          onClick={handleClose}
          className="text-white hover:bg-gray-800 p-2 rounded-full"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
              <p className="text-white">Loading meeting...</p>
            </div>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default JitsiMeeting;