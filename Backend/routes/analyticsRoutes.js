import express from 'express';
import Analysis from '../models/Analysis.js';
import { performRealtimeBusinessSearch } from '../utils/geminiService.js';

const router = express.Router();
const getUserId = (req) => req.headers['x-user-id'] || req.query.userId || 'default_user';

// GET /api/analytics/metrics
router.get('/metrics', async (req, res) => {
  try {
    const userId = getUserId(req);
    const analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.json({ success: true, empty: true });
    }

    res.json({
      success: true,
      empty: false,
      summary: analysis.summary,
      profile: analysis.profile,
      problems: analysis.problems || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/forecast
router.get('/forecast', async (req, res) => {
  try {
    const userId = getUserId(req);
    const analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!analysis || !analysis.forecastData) {
      return res.json({ success: true, available: false, message: 'No forecast data calculated.' });
    }

    res.json({ success: true, ...analysis.forecastData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/ml-analysis
router.get('/ml-analysis', async (req, res) => {
  try {
    const userId = getUserId(req);
    const analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!analysis || !analysis.mlAnalysis) {
      return res.json({ success: true, available: false, message: 'No ML analytical data calculated yet.' });
    }

    res.json({
      success: true,
      available: true,
      mlAnalysis: analysis.mlAnalysis,
      summary: analysis.summary,
      customerData: analysis.customerData,
      forecastData: analysis.forecastData,
      datasetName: analysis.datasetName
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/analytics/realtime-search
router.post('/realtime-search', async (req, res) => {
  try {
    const { query, industryType, businessContext } = req.body;
    if (!query || query.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query string is required.' });
    }

    const searchResult = await performRealtimeBusinessSearch(query, industryType, businessContext);
    res.json({ success: true, searchResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/analytics/free-calculator
router.post('/free-calculator', async (req, res) => {
  try {
    const { monthlyRevenue, monthlyExpenses, customerCount, industryType } = req.body;

    const rev = parseFloat(monthlyRevenue) || 0;
    const exp = parseFloat(monthlyExpenses) || 0;
    const cust = parseInt(customerCount) || 1;

    const netProfit = rev - exp;
    const profitMargin = rev > 0 ? ((netProfit / rev) * 100).toFixed(1) : '0.0';
    const avgRevenuePerCust = cust > 0 ? (rev / cust).toFixed(0) : '0';

    // Industry benchmark comparison
    const benchmarks = {
      'Retail': { targetMargin: 20, minHealth: 65 },
      'Restaurant': { targetMargin: 18, minHealth: 60 },
      'Services': { targetMargin: 30, minHealth: 70 },
      'Manufacturing': { targetMargin: 22, minHealth: 65 },
      'Healthcare': { targetMargin: 25, minHealth: 70 },
      'SaaS': { targetMargin: 35, minHealth: 75 },
      'General': { targetMargin: 20, minHealth: 65 }
    };

    const bm = benchmarks[industryType] || benchmarks['General'];
    const pMarginNum = parseFloat(profitMargin);
    
    let baseHealth = 50;
    if (rev > 0) baseHealth += 20;
    if (pMarginNum > 0) baseHealth += Math.min(25, pMarginNum);
    if (pMarginNum >= bm.targetMargin) baseHealth += 10;
    
    const healthScore = Math.min(100, Math.max(10, Math.round(baseHealth)));

    res.json({
      success: true,
      calculated: {
        monthlyRevenue: rev,
        monthlyExpenses: exp,
        netProfit,
        profitMargin: `${profitMargin}%`,
        avgRevenuePerCustomer: `₹${parseInt(avgRevenuePerCust).toLocaleString('en-IN')}`,
        healthScore,
        industryType: industryType || 'General',
        industryTargetMargin: `${bm.targetMargin}%`,
        marginStatus: pMarginNum >= bm.targetMargin ? 'Above Industry Benchmark' : 'Below Target Margin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

