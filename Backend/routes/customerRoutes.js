import express from 'express';
import CustomerData from '../models/CustomerData.js';

const router = express.Router();

// GET /api/customers/overview
router.get('/overview', async (req, res) => {
  try {
    const customers = await CustomerData.find().sort({ _id: 1 });
    res.json({
      success: true,
      stats: {
        totalCustomers: 3120,
        activeRetention: '92.4%',
        avgLtv: '$1,520',
        avgCac: '$235',
      },
      growthTrend: customers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/customers/churn-risk
router.get('/churn-risk', (req, res) => {
  res.json({
    success: true,
    churnRisks: [
      { id: 'CUST-102', name: 'Apex Tech Solutions', riskLevel: 'HIGH', lastActive: '24 days ago', ARR: '$12,400', reason: 'Feature usage drop (-65%)' },
      { id: 'CUST-108', name: 'Global Logistics Co', riskLevel: 'HIGH', lastActive: '21 days ago', ARR: '$18,000', reason: 'Unresolved support tickets' },
      { id: 'CUST-114', name: 'BrightByte Media', riskLevel: 'MEDIUM', lastActive: '14 days ago', ARR: '$8,200', reason: 'Decreased login frequency' },
      { id: 'CUST-120', name: 'Zenith Retail Network', riskLevel: 'MEDIUM', lastActive: '12 days ago', ARR: '$24,500', reason: 'Billing update pending' },
    ],
  });
});

export default router;
