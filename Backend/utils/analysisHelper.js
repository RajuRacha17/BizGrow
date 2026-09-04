import Analysis from '../models/Analysis.js';
import Dataset from '../models/Dataset.js';
import { parseFileBuffer, analyzeDataset } from './analyticsEngine.js';

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

/**
 * Get latest analysis for userId, or fallback to any existing analysis in DB,
 * or auto-seed sample analysis if database has no analysis record yet.
 */
export async function getOrSeedAnalysis(userId = 'default_user') {
  try {
    let analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });

    if (!analysis) {
      // Fallback 1: Any existing analysis in MongoDB
      analysis = await Analysis.findOne({}).sort({ createdAt: -1 });
    }

    if (!analysis) {
      // Fallback 2: Auto-seed sample analysis on-the-fly
      analysis = await seedSampleAnalysis(userId);
    }

    return analysis;
  } catch (err) {
    console.error('getOrSeedAnalysis error:', err.message);
    return null;
  }
}

/**
 * Seed sample business dataset and analysis
 */
export async function seedSampleAnalysis(userId = 'default_user') {
  try {
    const rawRows = parseFileBuffer(Buffer.from(sampleCsvContent), 'sample_business_data.csv');
    const analysisResult = analyzeDataset(rawRows);

    const newDataset = new Dataset({
      name: 'Sample Business Dataset',
      originalName: 'sample_business_data.csv',
      recordCount: rawRows.length,
      fileSize: '2.4 KB',
      status: 'PARSED',
      detectedPatterns: 8
    });
    await newDataset.save();

    const newAnalysis = new Analysis({
      userId,
      datasetId: newDataset._id.toString(),
      datasetName: newDataset.name,
      ...analysisResult
    });
    await newAnalysis.save();

    return newAnalysis;
  } catch (err) {
    console.error('seedSampleAnalysis error:', err.message);
    return null;
  }
}
