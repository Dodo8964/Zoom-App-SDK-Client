// pages/api/generateSignature.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { KJUR } from 'jsrsasign';

interface SignatureResponse {
  signature?: string;
  error?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureResponse>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { meetingNumber } = req.body;
  if (!meetingNumber) {
    res.status(400).json({ error: 'Meeting number is required' });
    return;
  }

  try {
    const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY as string;
    const sdkSecret = process.env.ZOOM_SDK_SECRET as string;
    const role = 0; // 0 for participant (or 1 for host if needed)
    const iat = Math.floor(Date.now() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // valid for 2 hours

    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sdkKey,
      appKey: sdkKey, // using sdkKey as appKey
      mn: meetingNumber,
      role,
      iat,
      exp,
      tokenExp: exp,
    };

    const signature = KJUR.jws.JWS.sign(
      'HS256',
      JSON.stringify(header),
      JSON.stringify(payload),
      sdkSecret
    );

    res.status(200).json({ signature });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: 'Error generating signature' });
  }
}
