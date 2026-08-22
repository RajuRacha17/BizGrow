import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  recordCount: { type: Number, default: 0 },
  fileSize: { type: String, default: '128 KB' },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['PARSED', 'PROCESSING', 'ERROR'], default: 'PARSED' },
  detectedPatterns: { type: Number, default: 12 },
});

const Dataset = mongoose.model('Dataset', datasetSchema);
export default Dataset;
