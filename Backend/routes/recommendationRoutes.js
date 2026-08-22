import express from 'express';
import Recommendation from '../models/Recommendation.js';

const router = express.Router();

// GET /api/recommendations
router.get('/', async (req, res) => {
  try {
    const recommendations = await Recommendation.find().sort({ priority: 1, impactScore: -1 });
    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/recommendations/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Recommendation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    res.json({ success: true, recommendation: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
