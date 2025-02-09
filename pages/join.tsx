// pages/join.tsx
import { useState, FormEvent, useEffect } from 'react';

export default function JoinMeeting() {
  const [meetingNumber, setMeetingNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  // On mount, try to prefill the userName from the stored client info.
  useEffect(() => {
    const clientStr = localStorage.getItem('client');
    if (clientStr) {
      const client = JSON.parse(clientStr);
      setUserName(client.name);
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Build a query string to pass to the meeting page.
    const query = new URLSearchParams({ meetingNumber, password, userName }).toString();
    const meetingUrl = `/meeting?${query}`;
    // Open the meeting page in a new tab.
    window.open(meetingUrl, '_blank');
  };

  return (
    <div style={{ margin: '50px' }}>
      <h1>Join Zoom Meeting</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="meetingNumber">Meeting Number: </label>
          <input
            id="meetingNumber"
            type="text"
            value={meetingNumber}
            onChange={(e) => setMeetingNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="userName">User Name: </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Join Meeting</button>
      </form>
    </div>
  );
}
