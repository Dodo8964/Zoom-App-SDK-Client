// pages/meeting.tsx
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Meeting() {
  const router = useRouter();
  const { meetingNumber, password, userName } = router.query;
  const meetingSDKRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState<string>('');

  // Fetch signature once router is ready and required params exist.
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

  // Initialize and join the meeting once signature is ready.
  useEffect(() => {
    if (!signature) return;
    async function joinMeeting() {
      // Dynamically import the Zoom Meeting SDK to ensure client-side only execution
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
            video:{
                isResizable:true,
                viewSizes: {
                    default:{
                        width:1120,
                        height:630,
                    }
                },
                popper:{
                    disableDraggable: true
                }
            },
        } 
    });
      client.join({
        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY as string,
        signature,
        meetingNumber: meetingNumber as string,
        password: password as string,
        userName: userName as string,
        // Optional: Add the ZAK token if required for your meeting settings.
        // zak: 'your_zak_token_here'
      });
    }
    joinMeeting();
  }, [signature, meetingNumber, password, userName]);

 return (
    <div>
      <h1>Zoom Meeting</h1>
      <div
        id="meetingSDKElement"
        ref={meetingSDKRef}
        style={{ width: '100%', height: '100vh' }}
      ></div>
    </div>
  );  
}
