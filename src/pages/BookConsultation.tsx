import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Video, Calendar, Clock as ClockIcon, User, Mail, Phone, X, Loader2, AlertCircle } from "lucide-react";
import { JitsiMeeting } from '@/components/meeting/JitsiMeeting';
import consultationImage from "@/assets/consultation-image.jpg";
import { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO, addMinutes, isSameDay, setHours, setMinutes } from 'date-fns';
import MeetingService from '@/services/meetingService';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';

// Jitsi Meet API type
type JitsiMeetExternalApi = {
  dispose: () => void;
  executeCommand: (command: string, ...args: any[]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
};


interface Meeting {
  _id: string;
  title?: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | string;
  jitsiMeetingId?: string;
  jitsiMeetingLink?: string;
  hostName?: string;
  hostEmail?: string;
  participants?: string[];
  fullName?: string;
  email?: string;
}

const WORKING_HOURS = {
  startHour: 8,
  endHour: 24, // Meetings can run until midnight
};
const BUFFER_MINUTES = 15;
const ACTIVE_MEETING_STATUSES: Array<Meeting['status'] | string> = ['scheduled', 'in-progress'];

const BookConsultation = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredDate: new Date(),
    preferredTime: setHours(setMinutes(new Date(), 0), WORKING_HOURS.startHour),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'book' | 'scheduled'>('book');
  const [activeMeeting, setActiveMeeting] = useState<{id: string; fullName: string} | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const benefits = [
    "Personalized guidance based on your profile",
    "Expert advice on university selection",
    "Clear understanding of the application process",
    "Visa requirements and procedures explained",
    "Scholarship and funding opportunities",
    "No obligation - completely free consultation",
  ];

  // Fetch meetings on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const meetingsData = await MeetingService.getAllMeetings();
        const normalized =
          Array.isArray(meetingsData) ? meetingsData : meetingsData?.items ?? [];
        setMeetings(normalized);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        // Only show message to non-authenticated users
        if (!user) {
          setError('You have no scheduled meetings yet. Login to book a meeting.');
        }
        setMeetings([]);
      }
    };

    fetchMeetings();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date change
  const handleDateChange = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      preferredDate: date
    }));
  };

  // Handle time change
  const handleTimeChange = (time: Date) => {
    setFormData(prev => ({
      ...prev,
      preferredTime: time
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!user) {
        const message = 'Please log in to book a consultation.';
        toast.error(message);
        setError(message);
        setIsLoading(false);
        return;
      }

      const startDateTime = new Date(formData.preferredDate);
      startDateTime.setHours(
        formData.preferredTime.getHours(),
        formData.preferredTime.getMinutes(),
        0,
        0
      );

      const now = new Date();
      if (startDateTime <= now) {
        const message = 'Please choose a future date and time for your consultation.';
        toast.error(message);
        setError(message);
        setIsLoading(false);
        return;
      }

      const endDateTime = addMinutes(startDateTime, 60);

      const bookingEmail = user.email?.toLowerCase() || '';
      const bookingName = user.name || formData.fullName;

      const alreadyScheduledSameDay = meetings.some((meeting) => {
        if (!meeting.hostEmail || !bookingEmail) return false;
        return (
          meeting.hostEmail.toLowerCase() === bookingEmail &&
          isSameDay(new Date(meeting.startTime), startDateTime)
        );
      });

      if (alreadyScheduledSameDay) {
        const message =
          'You already have a consultation booked on this day. Please choose another date.';
        toast.error(message);
        setError(message);
        setIsLoading(false);
        return;
      }

      const dayStart = new Date(startDateTime);
      dayStart.setHours(WORKING_HOURS.startHour, 0, 0, 0);
      const dayEnd = new Date(startDateTime);
      dayEnd.setHours(WORKING_HOURS.endHour, 0, 0, 0);

      if (startDateTime < dayStart || endDateTime > dayEnd) {
        const message = 'Please select a time within our working hours (8:00 AM - 12:00 AM).';
        toast.error(message);
        setError(message);
        setIsLoading(false);
        return;
      }

      const hasConflict = meetings.some((meeting) => {
        if (!ACTIVE_MEETING_STATUSES.includes(meeting.status)) return false;
        const meetingStart = new Date(meeting.startTime);
        const meetingEnd = new Date(meeting.endTime);
        const bufferStart = new Date(meetingStart.getTime() - BUFFER_MINUTES * 60 * 1000);
        const bufferEnd = new Date(meetingEnd.getTime() + BUFFER_MINUTES * 60 * 1000);

        return startDateTime < bufferEnd && endDateTime > bufferStart;
      });

      if (hasConflict) {
        const message = `This slot overlaps with another consultation. Please pick a time at least ${BUFFER_MINUTES} minutes apart from other bookings.`;
        toast.error(message);
        setError(message);
        setIsLoading(false);
        return;
      }

      await MeetingService.createMeeting({
        title: `Consultation for ${bookingName} with ScholarsHub`,
        description: `Scheduled consultation for ${bookingName}`,
        hostName: bookingName,
        hostEmail: user.email,
        participants: [user.email],
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        timeZone: 'Africa/Addis_Ababa',
      });

      const meetingsData = await MeetingService.getAllMeetings();
      const normalized =
        Array.isArray(meetingsData) ? meetingsData : meetingsData?.items ?? [];
      setMeetings(normalized);

      toast.success('Consultation booked successfully!');
      setSuccess('Consultation booked successfully!');
      setActiveTab('scheduled');

      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phoneNumber: '',
        preferredDate: new Date(),
        preferredTime: setHours(setMinutes(new Date(), 0), WORKING_HOURS.startHour),
      });
    } catch (err: any) {
      console.error('Error booking consultation:', err);
      const errorMessage = err.response?.data?.error || 'Failed to book consultation. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Format meeting time for display
  const formatMeetingTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPPpp');
    } catch (e) {
      return dateString;
    }
  };

  // Check if meeting can be joined (5 minutes before start time until end time)
  const canJoinMeeting = (startTime: string, endTime: string): boolean => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const fiveMinutesBefore = new Date(start.getTime() - 5 * 60 * 1000);
    
    return now >= fiveMinutesBefore && now <= end;
  };

  // Handle meeting end and remove from list
  const handleMeetingEnd = useCallback((meetingId: string) => {
    setActiveMeeting(null);
    setMeetings((prevMeetings) => {
      const endedMeeting = prevMeetings.find(
        (meeting) => meeting.jitsiMeetingId === meetingId || meeting._id === meetingId
      );

      if (endedMeeting?._id) {
        MeetingService.updateMeeting(endedMeeting._id, { status: 'completed' }).catch((err) => {
          console.error('Failed to update meeting status after ending:', err);
        });
      }

      return prevMeetings.filter(
        (meeting) => meeting.jitsiMeetingId !== meetingId && meeting._id !== meetingId
      );
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Book Your Free <span className="text-primary">Consultation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with our expert counselors and take the first step
            towards your study abroad journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">What You'll Get</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">💡 Pro Tip</h3>
                  <p className="text-muted-foreground">
                    Prepare a list of questions and have your academic documents ready
                    to make the most of your consultation session.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-2">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex border-b">
                    <button
                      className={`py-3 px-6 font-medium ${activeTab === 'book' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                      onClick={() => setActiveTab('book')}
                    >
                      Book New Consultation
                    </button>
                    <button
                      className={`py-3 px-6 font-medium ${activeTab === 'scheduled' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                      onClick={() => setActiveTab('scheduled')}
                    >
                      My Scheduled Consultations
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                      {success}
                    </div>
                  )}

                  {activeTab === 'book' ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <User size={16} /> Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            readOnly
                            className="w-full p-3 border rounded-md bg-muted/30 text-muted-foreground"
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Mail size={16} /> Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full p-3 border rounded-md bg-muted/30 text-muted-foreground"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Phone size={16} /> Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar size={16} /> Preferred Date
                          </label>
                          <DatePicker
                            selected={formData.preferredDate}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ClockIcon size={16} /> Preferred Time
                          </label>
                          <DatePicker
                            selected={formData.preferredTime}
                            onChange={handleTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            minTime={setHours(setMinutes(new Date(), 0), WORKING_HOURS.startHour)}
                            maxTime={setHours(setMinutes(new Date(), 0), WORKING_HOURS.endHour - 1)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full py-6 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Booking...' : 'Book Free Consultation'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {meetings.filter(meeting => meeting.status !== 'completed' && meeting.status !== 'cancelled').length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground">
                        No upcoming consultations scheduled
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Book a consultation to get started with your study abroad journey.
                      </p>
                      <Button
                        onClick={() => setActiveTab('book')}
                        className="mt-4"
                      >
                        Book a Consultation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meetings
                        .filter(meeting => {
                          const isNotCompleted = meeting.status !== 'completed';
                          const isNotCancelled = meeting.status !== 'cancelled';
                          const hasNotEnded = new Date(meeting.endTime) > new Date();
                          return isNotCompleted && isNotCancelled && hasNotEnded;
                        })
                        .map((meeting) => (
                            <Card key={meeting._id} className="border">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div>
                                    <h4 className="font-medium">{meeting.title || 'Consultation Meeting'}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                      <Clock className="mr-2 h-4 w-4" />
                                      {formatMeetingTime(meeting.startTime)}
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                      With: {meeting.hostName || meeting.fullName || 'Guest'}
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setActiveMeeting({
                                          id: meeting.jitsiMeetingId || meeting._id,
                                          fullName: meeting.hostName || meeting.fullName || 'Guest',
                                        })
                                      }
                                      className="flex items-center"
                                      disabled={
                                        !meeting.jitsiMeetingId || 
                                        meeting.status === 'completed' || 
                                        meeting.status === 'cancelled' ||
                                        !canJoinMeeting(meeting.startTime, meeting.endTime)
                                      }
                                      title={
                                        !canJoinMeeting(meeting.startTime, meeting.endTime)
                                          ? `Meeting can be joined from ${new Date(new Date(meeting.startTime).getTime() - 5 * 60 * 1000).toLocaleTimeString()}`
                                          : 'Join meeting'
                                      }
                                    >
                                      <Video className="mr-2 h-4 w-4" />
                                      {meeting.status === 'completed' || meeting.status === 'cancelled' || new Date() > new Date(meeting.endTime)
                                        ? 'Meeting Ended'
                                        : canJoinMeeting(meeting.startTime, meeting.endTime)
                                          ? 'Join Now'
                                          : 'Not Available Yet'}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Replace the MeetingEmbed component with JitsiMeeting */}
{activeMeeting && (
  <JitsiMeeting
    key={activeMeeting.id}
    meetingId={activeMeeting.id}
    displayName={activeMeeting.fullName || 'Guest'}
    onClose={() => setActiveMeeting(null)}
    onMeetingEnd={handleMeetingEnd}
  />
)}
    </main>
  );
};

export default BookConsultation;