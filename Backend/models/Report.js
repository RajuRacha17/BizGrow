import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g. Executive Summary, Financial Audit
  generatedAt: { type: Date, default: Date.now },
  size: { type: String, default: '2.4 MB' },
  status: { type: String, enum: ['READY', 'PROCESSING', 'FAILED'], default: 'READY' },
  downloadUrl: { type: String, default: '#' },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
