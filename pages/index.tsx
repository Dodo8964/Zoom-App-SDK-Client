// pages/index.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [meetingNumber, setMeetingNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new URLSearchParams({ meetingNumber, password, userName }).toString();
    const meetingUrl = `/meeting?${query}`;
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
