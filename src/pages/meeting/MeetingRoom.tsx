import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JitsiLoader } from '@/components/meeting/JitsiLoader';
import JitsiMeeting from '@/components/meeting/JitsiMeeting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MeetingRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isInMeeting, setIsInMeeting] = useState(false);
  const navigate = useNavigate();

  const handleStartMeeting = () => {
    if (!roomName.trim()) return;
    setIsInMeeting(true);
  };

  const handleMeetingEnd = () => {
    setIsInMeeting(false);
  };

  if (isInMeeting) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Meeting: {roomName}</h1>
            <Button variant="outline" onClick={handleMeetingEnd}>
              Leave Meeting
            </Button>
          </div>
        </header>
        
        <div className="flex-1">
          <JitsiLoader>
            {(isLoaded) => (
              <div className="h-full">
                {isLoaded ? (
                  <JitsiMeeting
                    roomName={roomName}
                    displayName={displayName || 'Guest'}
                    onMeetingEnd={handleMeetingEnd}
                    onError={(error) => console.error('Meeting error:', error)}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading meeting...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </JitsiLoader>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Start or Join a Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
                Meeting Room Name
              </label>
              <Input
                id="roomName"
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Your Name (Optional)
              </label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleStartMeeting}
                disabled={!roomName.trim()}
                className="w-full"
              >
                Join Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetingRoom;
