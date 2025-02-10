// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Client from '../../models/Client';

interface ResponseData {
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  await dbConnect();

  const { name, email, phone, password, sourceLanguage, targetLanguage } = req.body;

  if (!name || !email || !phone || !password || !sourceLanguage || !targetLanguage) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newClient = new Client({
      name,
      email,
      phone,
      password, 
      sourceLanguage,
      targetLanguage,
    });
    await newClient.save();
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
}
