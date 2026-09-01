import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  datasetId: { type: String, required: true },
  datasetName: { type: String, default: 'Uploaded Dataset' },
  summary: { type: Object, default: {} },
  profile: { type: Object, default: {} },
  colMap: { type: Object, default: {} },
  salesData: { type: Array, default: [] },
  productPerformanceData: { type: Array, default: [] },
  regionalPerformance: { type: Array, default: [] },
  categoryBreakdown: { type: Array, default: [] },
  customerData: { type: Object, default: {} },
  forecastData: { type: Object, default: {} },
  problems: { type: Array, default: [] },
  alerts: { type: Array, default: [] },
  recommendations: { type: Array, default: [] },
  previewRows: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
