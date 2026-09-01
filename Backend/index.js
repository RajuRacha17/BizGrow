import dns from 'dns';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e);
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pbis';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', timestamp: new Date() });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (without MongoDB connection)`);
    });
  });
