import mongoose from 'mongoose';

const alertItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  reason: { type: String, default: '' },
  metric: { type: String, default: '' },
  status: { type: String, enum: ['UNREAD', 'READ', 'DISMISSED'], default: 'UNREAD' },
  date: { type: String, default: () => new Date().toLocaleDateString() },
  createdAt: { type: Date, default: Date.now },
});

const AlertItem = mongoose.model('AlertItem', alertItemSchema);
export default AlertItem;
