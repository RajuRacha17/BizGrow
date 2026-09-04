import express from 'express';
import Analysis from '../models/Analysis.js';

const router = express.Router();

const getUserId = (req) => req.headers['x-user-id'] || req.query.userId || 'default_user';

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const userId = getUserId(req);
    const latestAnalysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestAnalysis) {
      return res.json({
        success: true,
        empty: true,
        message: 'No business dataset analyzed yet.',
        data: {
          healthScore: 0,
          healthStatus: 'No Data',
          monthlyRevenue: 0,
          totalSales: 0,
          totalProfit: 0,
          activeCustomers: 0,
        }
      });
    }

    res.json({
      success: true,
      empty: false,
      data: latestAnalysis.summary,
      analysis: latestAnalysis
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dashboard/charts
router.get('/charts', async (req, res) => {
  try {
    const userId = getUserId(req);
    const latestAnalysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestAnalysis) {
      return res.json({
        success: true,
        empty: true,
        salesData: [],
        customerGrowthData: [],
        productPerformanceData: [],
        regionalPerformance: []
      });
    }

    res.json({
      success: true,
      empty: false,
      salesData: latestAnalysis.salesData || [],
      customerGrowthData: latestAnalysis.customerData?.segments || [],
      productPerformanceData: latestAnalysis.productPerformanceData || [],
      regionalPerformance: latestAnalysis.regionalPerformance || [],
      categoryBreakdown: latestAnalysis.categoryBreakdown || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
