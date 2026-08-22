import express from 'express';
import SalesData from '../models/SalesData.js';
import CustomerData from '../models/CustomerData.js';

const router = express.Router();

// GET /api/analytics/metrics
router.get('/metrics', async (req, res) => {
  try {
    const customers = await CustomerData.find().sort({ _id: -1 });
    const latest = customers[0] || {};

    res.json({
      success: true,
      metrics: {
        cac: latest.cac || 235,
        ltv: latest.ltv || 1520,
        churnRate: `${latest.churnRate || 2.8}%`,
        profitMargin: '68.4%',
        revenueGrowthRate: '14.8%',
        clvCacRatio: '6.47x',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/transactions
router.get('/transactions', (req, res) => {
  res.json({
    success: true,
    transactions: [
      { id: 'TX-9041', customer: 'Acme Corp', amount: '$4,800', date: '2026-08-20', status: 'COMPLETED', plan: 'Enterprise Cloud' },
      { id: 'TX-9042', customer: 'Starlight Media', amount: '$1,250', date: '2026-08-20', status: 'COMPLETED', plan: 'SaaS Suite Pro' },
      { id: 'TX-9043', customer: 'Nexus Systems', amount: '$850', date: '2026-08-19', status: 'COMPLETED', plan: 'AI Insights Addon' },
      { id: 'TX-9044', customer: 'Vortex Labs', amount: '$2,400', date: '2026-08-19', status: 'PENDING', plan: 'Custom API Tier' },
      { id: 'TX-9045', customer: 'Omni Retail', amount: '$6,200', date: '2026-08-18', status: 'COMPLETED', plan: 'Enterprise Cloud' },
    ],
  });
});

// GET /api/analytics/forecast
router.get('/forecast', async (req, res) => {
  try {
    const forecast = [
      { month: 'Aug 2026', projectedRevenue: 138000, confidenceLower: 131000, confidenceUpper: 145000 },
      { month: 'Sep 2026', projectedRevenue: 149500, confidenceLower: 140000, confidenceUpper: 158000 },
      { month: 'Oct 2026', projectedRevenue: 162000, confidenceLower: 151000, confidenceUpper: 172000 },
      { month: 'Nov 2026', projectedRevenue: 176000, confidenceLower: 162000, confidenceUpper: 189000 },
      { month: 'Dec 2026', projectedRevenue: 191000, confidenceLower: 175000, confidenceUpper: 206000 },
    ];

    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
