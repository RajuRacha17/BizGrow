import express from 'express';
import Analysis from '../models/Analysis.js';
import ActionItem from '../models/ActionItem.js';

const router = express.Router();
const getUserId = (req) => req.headers['x-user-id'] || req.query.userId || 'default_user';

// GET /api/recommendations
router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });
    const actionItems = await ActionItem.find({ userId }).sort({ createdAt: -1 });

    const recommendations = analysis ? (analysis.recommendations || []) : [];

    res.json({
      success: true,
      recommendations,
      actionItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/recommendations/actions
router.post('/actions', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, problem, evidence, recommendedAction, priority, dueDate } = req.body;

    const newItem = new ActionItem({
      userId,
      title,
      problem,
      evidence,
      recommendedAction,
      priority: priority || 'HIGH',
      dueDate: dueDate || 'Next 14 Days',
      status: 'PENDING'
    });

    await newItem.save();
    res.status(201).json({ success: true, actionItem: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/recommendations/actions/:id
router.patch('/actions/:id', async (req, res) => {
  try {
    const { status, notes, priority } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (priority) updateData.priority = priority;

    const updated = await ActionItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Action item not found' });
    }

    res.json({ success: true, actionItem: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
