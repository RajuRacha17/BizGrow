import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne().sort({ createdAt: -1 });
    res.json({
      success: true,
      profile: {
        fullName: user ? user.fullName : 'James Davidson',
        email: user ? user.email : 'james@techventures.io',
        businessName: user && user.businessName ? user.businessName : 'TechVentures Inc.',
        role: 'CEO & Founder',
        plan: 'Enterprise Tier',
        apiKey: 'pbis_live_sk_8941f7a2d409',
        notifications: {
          emailAlerts: true,
          weeklyDigest: true,
          anomalyAlerts: true,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const { fullName, email, businessName } = req.body;
    let user = await User.findOne().sort({ createdAt: -1 });
    if (user) {
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (businessName) user.businessName = businessName;
      await user.save();
    }
    res.json({
      success: true,
      message: 'Settings updated successfully',
      profile: {
        fullName: user ? user.fullName : fullName,
        email: user ? user.email : email,
        businessName: user ? user.businessName : businessName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
