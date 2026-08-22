import mongoose from 'mongoose';

const salesDataSchema = new mongoose.Schema({
  month: { type: String, required: true },
  sales: { type: Number, required: true },
  revenue: { type: Number, required: true },
  target: { type: Number, required: true },
  year: { type: Number, default: 2026 },
  createdAt: { type: Date, default: Date.now },
});

const SalesData = mongoose.model('SalesData', salesDataSchema);
export default SalesData;
