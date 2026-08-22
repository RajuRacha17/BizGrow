import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g. P01, P02
  title: { type: String, required: true },
  description: { type: String, required: true },
  upside: { type: String, required: true }, // e.g. "+$14.2K/mo"
  impactScore: { type: Number, default: 92 },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
  category: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'APPLIED', 'DISMISSED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
