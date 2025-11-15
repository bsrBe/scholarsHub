import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './MeetingBooking.css';

const MeetingBooking = () => {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredDate: new Date(),
    preferredTime: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch meetings on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('/api/meetings');
        // Ensure we're working with an array
        const meetingsData = Array.isArray(response.data) ? response.data : [];
        setMeetings(meetingsData);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setError('Failed to load meetings. Please try again later.');
        // Set to empty array on error to prevent map errors
        setMeetings([]);
      }
    };

    fetchMeetings();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      preferredDate: date
    }));
  };

  // Handle time change
  const handleTimeChange = (time) => {
    setFormData(prev => ({
      ...prev,
      preferredTime: time
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Format date and time for the API
      const formattedDate = format(formData.preferredDate, 'yyyy-MM-dd');
      const formattedTime = format(formData.preferredTime, 'HH:mm');

      const response = await axios.post('/api/meetings', {
        ...formData,
        preferredDate: formattedDate,
        preferredTime: formattedTime,
      });

      // Refresh the meetings list to ensure we have the latest data
      const meetingsResponse = await axios.get('/api/meetings');
      const meetingsData = Array.isArray(meetingsResponse.data) ? meetingsResponse.data : [];
      setMeetings(meetingsData);
      
      // Show success message
      setSuccess('Meeting booked successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        preferredDate: new Date(),
        preferredTime: new Date(),
      });
    } catch (err) {
      console.error('Error booking meeting:', err);
      setError(err.response?.data?.error || 'Failed to book meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatMeetingTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="meeting-booking">
      <h1>Schedule a Meeting</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="booking-form-container">
        <h2>Book a New Meeting</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number (optional)"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date</label>
              <DatePicker
                selected={formData.preferredDate}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="date-picker"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Preferred Time</label>
              <DatePicker
                selected={formData.preferredTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                timeFormat="h:mm aa"
                className="time-picker"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Booking...' : 'Book Meeting'}
          </button>
        </form>
      </div>
      
      <div className="meetings-list">
        <h2>Your Scheduled Meetings</h2>
        {!meetings || meetings.length === 0 ? (
          <p>No meetings scheduled yet. Book a meeting above.</p>
        ) : (
          <div className="meetings-grid">
            {meetings && meetings.map((meeting) => (
              <div key={meeting._id} className="meeting-card">
                <h3>{meeting.title}</h3>
                <p><strong>Time:</strong> {formatMeetingTime(meeting.startTime)}</p>
                <p><strong>Status:</strong> {meeting.status}</p>
                <div className="meeting-actions">
                  <a 
                    href={`/api/meetings/${meeting._id}/join`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    Join Meeting (New Tab)
                  </a>
                  <a 
                    href={`/api/meetings/${meeting._id}/join/MyName`} 
                    className="btn-primary"
                  >
                    Join in Browser
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingBooking;
