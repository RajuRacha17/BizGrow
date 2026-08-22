import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SalesData from './models/SalesData.js';
import CustomerData from './models/CustomerData.js';
import Recommendation from './models/Recommendation.js';
import Report from './models/Report.js';
import Dataset from './models/Dataset.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pbis';

const seedSales = [
  { month: 'Jan', sales: 42000, revenue: 58000, target: 45000 },
  { month: 'Feb', sales: 49000, revenue: 64000, target: 48000 },
  { month: 'Mar', sales: 58000, revenue: 79000, target: 52000 },
  { month: 'Apr', sales: 53000, revenue: 71000, target: 55000 },
  { month: 'May', sales: 71000, revenue: 94000, target: 60000 },
  { month: 'Jun', sales: 84000, revenue: 112000, target: 68000 },
  { month: 'Jul', sales: 96000, revenue: 128450, target: 75000 },
];

const seedCustomers = [
  { month: 'Jan', newCust: 320, active: 1800, churnRate: 3.8, ltv: 1380, cac: 260 },
  { month: 'Feb', newCust: 410, active: 2050, churnRate: 3.5, ltv: 1410, cac: 255 },
  { month: 'Mar', newCust: 480, active: 2310, churnRate: 3.4, ltv: 1420, cac: 250 },
  { month: 'Apr', newCust: 520, active: 2540, churnRate: 3.2, ltv: 1440, cac: 245 },
  { month: 'May', newCust: 610, active: 2780, churnRate: 3.0, ltv: 1460, cac: 240 },
  { month: 'Jun', newCust: 690, active: 2950, churnRate: 2.9, ltv: 1480, cac: 238 },
  { month: 'Jul', newCust: 750, active: 3120, churnRate: 2.8, ltv: 1520, cac: 235 },
];

const seedRecommendations = [
  {
    code: 'P01',
    title: 'Cross-Sell AI Upgrade to SaaS Pro Cohort',
    description: 'Target high-usage SaaS accounts with personalized automated upselling to increase tier conversion rate.',
    upside: '+$14.2K/mo',
    impactScore: 94,
    priority: 'HIGH',
    category: 'Sales Expansion',
    status: 'ACTIVE',
  },
  {
    code: 'P02',
    title: 'Re-Engage Inactive SMB Accounts (21-Day Inactivity)',
    description: 'Automate success check-in campaign to recover churning accounts before subscription renewal.',
    upside: '+$8.4K/mo',
    impactScore: 88,
    priority: 'HIGH',
    category: 'Customer Retention',
    status: 'ACTIVE',
  },
  {
    code: 'P03',
    title: 'Reallocate Ad Spend from Search to LinkedIn',
    description: 'Shift search ad budget to targeted B2B LinkedIn campaigns to reduce overall CAC by 18%.',
    upside: '+$6.1K/mo',
    impactScore: 82,
    priority: 'MEDIUM',
    category: 'Marketing Efficiency',
    status: 'ACTIVE',
  },
  {
    code: 'P04',
    title: 'Automate Restock Order Trigger for SKU-402',
    description: 'Prevent inventory depletion during peak demand periods by setting automated reorder thresholds.',
    upside: '+$4.8K/mo',
    impactScore: 78,
    priority: 'MEDIUM',
    category: 'Operations & Inventory',
    status: 'ACTIVE',
  },
  {
    code: 'P05',
    title: 'Staging Server Auto-Scaling Schedule',
    description: 'Automate off-peak shutdown of non-production cloud nodes to reduce server infrastructure overhead.',
    upside: '+$2.8K/mo',
    impactScore: 75,
    priority: 'LOW',
    category: 'Cost Optimization',
    status: 'ACTIVE',
  },
];

const seedReports = [
  {
    title: 'Q3 Executive Performance Audit & Forecast',
    type: 'Executive Audit',
    size: '3.8 MB',
    status: 'READY',
  },
  {
    title: 'Customer Cohort Churn & LTV Deep Dive',
    type: 'Customer Intelligence',
    size: '2.1 MB',
    status: 'READY',
  },
  {
    title: 'Product Line Margin & SKU Velocity Report',
    type: 'Product Performance',
    size: '1.9 MB',
    status: 'READY',
  },
];

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    await SalesData.deleteMany({});
    await CustomerData.deleteMany({});
    await Recommendation.deleteMany({});
    await Report.deleteMany({});

    await SalesData.insertMany(seedSales);
    await CustomerData.insertMany(seedCustomers);
    await Recommendation.insertMany(seedRecommendations);
    await Report.insertMany(seedReports);

    console.log('Successfully seeded SalesData, CustomerData, Recommendations, and Reports!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seedDB();
