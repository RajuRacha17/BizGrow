import express from 'express';
import Analysis from '../models/Analysis.js';

const router = express.Router();
const getUserId = (req) => req.headers['x-user-id'] || req.query.userId || 'default_user';

// GET /api/customers/overview
router.get('/overview', async (req, res) => {
  try {
    const userId = getUserId(req);
    const analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!analysis || !analysis.customerData) {
      return res.json({ success: true, customerData: { available: false, message: 'No dataset analyzed yet.' } });
    }

    res.json({
      success: true,
      customerData: analysis.customerData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
