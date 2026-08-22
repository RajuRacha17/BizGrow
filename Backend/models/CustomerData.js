import mongoose from 'mongoose';

const customerDataSchema = new mongoose.Schema({
  month: { type: String, required: true },
  newCust: { type: Number, required: true },
  active: { type: Number, required: true },
  churnRate: { type: Number, default: 3.2 },
  ltv: { type: Number, default: 1450 },
  cac: { type: Number, default: 240 },
  year: { type: Number, default: 2026 },
  createdAt: { type: Date, default: Date.now },
});

const CustomerData = mongoose.model('CustomerData', customerDataSchema);
export default CustomerData;
