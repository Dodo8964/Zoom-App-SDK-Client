// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function Dashboard() {
  const [clientName, setClientName] = useState('');
  const [incomingCall, setIncomingCall] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');

  // Retrieve client info from localStorage.
  useEffect(() => {
    const clientStr = localStorage.getItem('client');
    if (clientStr) {
      const client = JSON.parse(clientStr);
      setClientName(client.name);
    }
  }, []);

  // Initialize the socket connection.
  useEffect(() => {
    // Ensure the Socket.IO server is initialized.
    fetch('/api/socket');

    const storedClient = localStorage.getItem('client');
    const clientEmail = storedClient ? JSON.parse(storedClient).email : '';

    socket = io({ query: { email: clientEmail } });

    socket.on('connect', () => {
      console.log('Connected to socket with id:', socket.id);
    });

    // Listen for the incoming call event.
    socket.on('incoming_call', (data: { customLink: string }) => {
      console.log('Incoming call data:', data);
      if (data.customLink) {
        setMeetingLink(data.customLink);
        setIncomingCall(true);
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleAccept = () => {
    try {
      const url = new URL(meetingLink);
      const parts = url.pathname.split('/j/');
      if (parts.length < 2) {
        console.error('Invalid meeting URL format');
        return;
      }
      const meetingNumber = parts[1];
      const meetingPwd = url.searchParams.get('pwd') || '';

      // Build the URL for the meeting page with query parameters.
      const meetingUrl = `/meeting?meetingNumber=${encodeURIComponent(
        meetingNumber
      )}&password=${encodeURIComponent(meetingPwd)}&userName=${encodeURIComponent(
        clientName
      )}`;

      // Open the meeting page in a new tab.
      window.open(meetingUrl, '_blank');
      setIncomingCall(false);
    } catch (error) {
      console.error('Error processing meeting join:', error);
    }
  };

  // Handler for declining the call.
  const handleDecline = () => {
    setIncomingCall(false);
    setMeetingLink('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>
        Welcome, <strong>{clientName}</strong>
      </p>
      <p>
        Status: <span style={{ color: 'green' }}>Online</span> &mdash; Waiting to receive a call.
      </p>

      {incomingCall && (
        <div
          style={{
            border: '1px solid #ccc',
            padding: '20px',
            marginTop: '20px',
            maxWidth: '400px',
          }}
        >
          <h2>Incoming Call</h2>
          <p>
            You have an incoming call for interpretation
            <br />
          </p>
          <button onClick={handleAccept} style={{ marginRight: '10px' }}>
            Accept
          </button>
          <button onClick={handleDecline}>Decline</button>
        </div>
      )}
    </div>
  );
}
