import mongoose from 'mongoose';

const actionItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  problem: { type: String, default: '' },
  evidence: { type: String, default: '' },
  recommendedAction: { type: String, default: '' },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], default: 'PENDING' },
  notes: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const ActionItem = mongoose.model('ActionItem', actionItemSchema);
export default ActionItem;
