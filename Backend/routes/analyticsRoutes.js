import express from 'express';
import Analysis from '../models/Analysis.js';

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

export default router;
