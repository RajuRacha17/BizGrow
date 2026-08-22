import express from 'express';
import SalesData from '../models/SalesData.js';
import CustomerData from '../models/CustomerData.js';
import Recommendation from '../models/Recommendation.js';

const router = express.Router();

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const sales = await SalesData.find().sort({ _id: 1 });
    const customers = await CustomerData.find().sort({ _id: 1 });
    const recommendations = await Recommendation.find({ status: 'ACTIVE' });

    const latestSales = sales[sales.length - 1] || { revenue: 128450, sales: 96000 };
    const latestCustomer = customers[customers.length - 1] || { active: 3120 };

    res.json({
      success: true,
      data: {
        healthScore: 94,
        healthChange: '+5.2%',
        monthlyRevenue: latestSales.revenue,
        revenueChange: '+14.8%',
        activeCustomers: latestCustomer.active,
        customerChange: '+9.2%',
        conversionRate: '3.42%',
        conversionChange: '+1.2%',
        aiInsightsCount: recommendations.length,
        workflowStep: 2,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dashboard/charts
router.get('/charts', async (req, res) => {
  try {
    const sales = await SalesData.find().sort({ _id: 1 });
    const customers = await CustomerData.find().sort({ _id: 1 });

    const productPerformance = [
      { name: 'SaaS Suite Pro', value: 45, color: '#2563EB' },
      { name: 'AI Insights Addon', value: 25, color: '#7C3AED' },
      { name: 'Enterprise Cloud', value: 18, color: '#10B981' },
      { name: 'Custom API Tier', value: 12, color: '#F59E0B' },
    ];

    res.json({
      success: true,
      salesData: sales,
      customerGrowthData: customers,
      productPerformanceData: productPerformance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dashboard/workflow
router.get('/workflow', (req, res) => {
  res.json({
    success: true,
    steps: [
      { num: '01', label: 'Business Data', status: 'COMPLETED' },
      { num: '02', label: 'AI Analysis', status: 'ACTIVE' },
      { num: '03', label: 'Problem Detection', status: 'READY' },
      { num: '04', label: 'Performance Gap', status: 'READY' },
      { num: '05', label: 'Recommendations', status: 'READY' },
      { num: '06', label: 'Business Growth', status: 'READY' },
    ],
  });
});

export default router;
