import express from 'express';
import Analysis from '../models/Analysis.js';
import Report from '../models/Report.js';

const router = express.Router();
const getUserId = (req) => req.headers['x-user-id'] || req.query.userId || 'default_user';

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });
    const reports = await Report.find().sort({ generatedAt: -1 });

    res.json({
      success: true,
      reports,
      analysisSummary: analysis ? analysis.summary : null,
      analysis: analysis || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/reports/generate
router.post('/generate', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, type } = req.body;

    const newReport = new Report({
      title: title || `Executive BI Audit - ${new Date().toLocaleDateString()}`,
      type: type || 'Executive Summary',
      size: '2.8 MB',
      status: 'READY',
    });

    await newReport.save();
    res.status(201).json({ success: true, report: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
