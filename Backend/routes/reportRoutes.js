import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ generatedAt: -1 });
    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/reports/generate
router.post('/generate', async (req, res) => {
  try {
    const { title, type } = req.body;
    const newReport = new Report({
      title: title || 'Executive BI Diagnostic Report',
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
