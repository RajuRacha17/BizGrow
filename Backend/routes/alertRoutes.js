import express from 'express';
import AlertItem from '../models/AlertItem.js';

const router = express.Router();
const getUserId = (req) => req.headers['x-user-id'] || req.query.userId || 'default_user';

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const alerts = await AlertItem.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/alerts/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await AlertItem.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, alert: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
