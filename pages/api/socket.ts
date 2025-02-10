// pages/api/socket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import dbConnect from '../../lib/dbConnect';
import Client from '../../models/Client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket: any = res.socket;

  // Initialize Socket.IO server only once
  if (!socket.server?.io) {
    await dbConnect();
    console.log('Initializing Socket.IO on Next.js server...');
    const io = new Server(socket.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    socket.server.io = io;

    io.on('connection', async (socket) => {
      console.log(`New socket connection: ${socket.id}`);
      const email = socket.handshake.query.email as string;

      if (email) {
        try {
          const client = await Client.findOne({ email });
          if (client) {
            client.socketID = socket.id;
            client.onlineStatus = true;
            await client.save();
            console.log(`Updated client ${email} with socket ID: ${socket.id}`);
          }
        } catch (error) {
          console.error('Error updating client on socket connect:', error);
        }
      } else {
        console.log(`Socket ${socket.id} did not provide an email.`);
      }

      socket.on(
        'incoming_call',
        (data: { customerSocketId: string; clientSocketId: string; customLink: string }) => {
          console.log(`Received incoming_call event: ${JSON.stringify(data)}`);
          const { clientSocketId, customerSocketId, customLink } = data;
          io.to(clientSocketId).emit('incoming_call', { customerSocketId, customLink });
        }
      );

      socket.on('disconnect', async () => {
        console.log(`Socket disconnected: ${socket.id}`);
        try {
          await Client.findOneAndUpdate(
            { socketID: socket.id },
            { onlineStatus: false, socketID: null }
          );
          console.log(`Cleared socket info for ${socket.id}`);
        } catch (error) {
          console.error('Error clearing socket on disconnect:', error);
        }
      });
    });
  }
  res.end();
}
