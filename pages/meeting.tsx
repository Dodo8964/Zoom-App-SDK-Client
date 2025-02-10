// pages/meeting.tsx
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Meeting() {
  const router = useRouter();
  const { meetingNumber, password, userName } = router.query;
  const meetingSDKRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<string>('');

  useEffect(() => {
    if (!router.isReady) return;
    if (!meetingNumber || !password || !userName) {
      console.error('Missing meeting parameters');
      return;
    }
    async function fetchSignature() {
      try {
        const res = await fetch('/api/generateSignature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingNumber }),
        });
        const data = await res.json();
        if (data.signature) {
          setSignature(data.signature);
        } else {
          console.error('Failed to fetch signature', data);
        }
      } catch (err) {
        console.error('Error fetching signature:', err);
      }
    }
    fetchSignature();
  }, [router.isReady, meetingNumber, password, userName]);
  useEffect(() => {
    if (!signature) return;
    async function joinMeeting() {
      const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
      const client = ZoomMtgEmbedded.createClient();
      const meetingSDKElement = meetingSDKRef.current;
      if (!meetingSDKElement) {
        console.error('Meeting SDK element not found');
        return;
      }

      client.init({ 
        zoomAppRoot: meetingSDKElement, 
        language: 'en-US',
        customize: {
          video: {
            isResizable: true,
            viewSizes: {
              default: {
                width: 960,
                height: 540,
              },
            },
            popper: {
              disableDraggable: true,
            },
          },
        } 
      });
      client.join({
        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY as string,
        signature,
        meetingNumber: meetingNumber as string,
        password: password as string,
        userName: userName as string,
      });
    }
    joinMeeting();
  }, [signature, meetingNumber, password, userName]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        height: '100vh',
      }}
    >
      <header
        style={{
          width: '100%',
          padding: '10px 0',
          backgroundColor: '#f2f2f2',
          textAlign: 'center',
        }}
      >
        <h1>Client Meet</h1>
      </header>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          id="meetingSDKElement"
          ref={meetingSDKRef}
          style={{ width: '1120px', height: '630px' }}
        ></div>
      </div>
    </div>
  );  
}
