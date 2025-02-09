// models/Client.ts
import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  onlineStatus: { type: Boolean, default: false },
  socketID: { type: String, default: null },
});

// Use existing model if already compiled
export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
