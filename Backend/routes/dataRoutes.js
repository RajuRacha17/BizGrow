import express from 'express';
import multer from 'multer';
import Dataset from '../models/Dataset.js';
import Analysis from '../models/Analysis.js';
import ActionItem from '../models/ActionItem.js';
import AlertItem from '../models/AlertItem.js';
import { parseFileBuffer, analyzeDataset } from '../utils/analyticsEngine.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to get current user identifier
const getUserId = (req) => {
  return req.headers['x-user-id'] || req.query.userId || 'default_user';
};

// POST /api/data/upload
router.post('/upload', upload.single('dataset'), async (req, res) => {
  try {
    const file = req.file;
    const userId = getUserId(req);
    const datasetName = req.body.name || (file ? file.originalname : 'Uploaded_Business_Dataset.csv');

    if (!file && !req.body.sampleData) {
      return res.status(400).json({ success: false, message: 'Please attach a .csv, .xlsx, or .xls file to upload.' });
    }

    let rawRows = [];
    let originalName = 'dataset.csv';
    let fileSize = '128 KB';

    if (file) {
      originalName = file.originalname;
      fileSize = `${(file.size / 1024).toFixed(1)} KB`;
      rawRows = parseFileBuffer(file.buffer, originalName);
    }

    if (rawRows.length === 0) {
      return res.status(400).json({ success: false, message: 'Uploaded file is empty or could not be parsed.' });
    }

    // Run Analytics Engine
    const analysisResult = analyzeDataset(rawRows);

    // Save Dataset metadata
    const newDataset = new Dataset({
      name: datasetName,
      originalName,
      recordCount: analysisResult.profile.totalRows || rawRows.length,
      fileSize,
      status: 'PARSED',
      detectedPatterns: (analysisResult.problems || []).length + (analysisResult.recommendations || []).length,
    });
    await newDataset.save();

    // Save Analysis record
    const newAnalysis = new Analysis({
      userId,
      datasetId: newDataset._id.toString(),
      datasetName: newDataset.name,
      ...analysisResult,
    });
    await newAnalysis.save();

    // Create Action Items from Recommendations
    if (analysisResult.recommendations && analysisResult.recommendations.length > 0) {
      await ActionItem.deleteMany({ userId }); // Reset previous action plan for clean state
      const actionDocs = analysisResult.recommendations.map(rec => ({
        userId,
        title: rec.title,
        problem: rec.problem,
        evidence: rec.evidence,
        recommendedAction: rec.recommendedAction,
        priority: rec.priority,
        status: 'PENDING',
        dueDate: 'Next 14 Days'
      }));
      await ActionItem.insertMany(actionDocs);
    }

    // Create Alert Items
    if (analysisResult.alerts && analysisResult.alerts.length > 0) {
      await AlertItem.deleteMany({ userId });
      const alertDocs = analysisResult.alerts.map(alt => ({
        userId,
        title: alt.title,
        severity: alt.severity,
        reason: alt.reason,
        metric: alt.metric,
        status: 'UNREAD'
      }));
      await AlertItem.insertMany(alertDocs);
    }

    // Always create a Dataset Upload Notification Alert for the user
    const uploadNotification = new AlertItem({
      userId,
      title: 'Dataset Uploaded Successfully',
      severity: 'MEDIUM',
      reason: `Dataset "${datasetName}" (${analysisResult.profile.totalRows || rawRows.length} records) was uploaded & analyzed.`,
      metric: 'Data Ingestion',
      status: 'UNREAD',
      date: new Date().toLocaleDateString()
    });
    await uploadNotification.save();

    res.status(201).json({
      success: true,
      message: 'Business dataset uploaded & analyzed successfully!',
      dataset: newDataset,
      analysis: newAnalysis,
    });
  } catch (error) {
    console.error('Data upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error processing data upload.' });
  }
});

// GET /api/data/sample
router.get('/sample', (req, res) => {
  const sampleCsvContent = `Date,Order_ID,Customer_ID,Customer_Name,Product,Category,Quantity,Unit_Price,Sales_Amount,Cost_Amount,Profit,Region
2026-08-01,ORD-1001,CUST-201,Acme Corp,SaaS Suite Pro,SaaS & Tech,5,1200,6000,1800,4200,North America
2026-08-02,ORD-1002,CUST-202,Starlight Media,AI Insights Addon,AI Tools,10,350,3500,800,2700,Europe
2026-08-03,ORD-1003,CUST-203,Nexus Systems,Enterprise Cloud,Cloud Services,2,4500,9000,3200,5800,Asia Pacific
2026-08-04,ORD-1004,CUST-204,Vortex Labs,Custom API Tier,API & Data,1,2800,2800,900,1900,North America
2026-08-05,ORD-1005,CUST-205,Omni Retail,SaaS Suite Pro,SaaS & Tech,8,1200,9600,2800,6800,Latin America
2026-08-06,ORD-1006,CUST-201,Acme Corp,AI Insights Addon,AI Tools,4,350,1400,350,1050,North America
2026-08-07,ORD-1007,CUST-206,BrightByte Media,Enterprise Cloud,Cloud Services,3,4500,13500,4800,8700,Europe
2026-08-08,ORD-1008,CUST-207,Zenith Network,Custom API Tier,API & Data,2,2800,5600,1800,3800,Asia Pacific
2026-08-09,ORD-1009,CUST-202,Starlight Media,SaaS Suite Pro,SaaS & Tech,6,1200,7200,2100,5100,Europe
2026-08-10,ORD-1010,CUST-208,Apex Solutions,AI Insights Addon,AI Tools,12,350,4200,1100,3100,North America
2026-08-11,ORD-1011,CUST-209,Global Logistics,Enterprise Cloud,Cloud Services,4,4500,18000,6200,11800,Middle East
2026-08-12,ORD-1012,CUST-210,Quantum Tech,SaaS Suite Pro,SaaS & Tech,3,1200,3600,1100,2500,Latin America`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sample_business_data.csv"');
  res.status(200).send(sampleCsvContent);
});

// GET /api/data/history
router.get('/history', async (req, res) => {
  try {
    const datasets = await Dataset.find().sort({ uploadedAt: -1 });
    res.json({ success: true, datasets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/data/:id
router.delete('/:id', async (req, res) => {
  try {
    await Dataset.findByIdAndDelete(req.params.id);
    await Analysis.deleteMany({ datasetId: req.params.id });
    res.json({ success: true, message: 'Dataset deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
