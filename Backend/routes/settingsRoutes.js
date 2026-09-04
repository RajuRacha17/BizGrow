import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

const getTargetUser = async (req) => {
  const userId = req.headers['x-user-id'];
  let user = null;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId);
  }
  if (!user && userId && userId.includes('@')) {
    user = await User.findOne({ email: userId.toLowerCase().trim() });
  }
  if (!user) {
    user = await User.findOne().sort({ createdAt: -1 });
  }
  return user;
};

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const user = await getTargetUser(req);
    res.json({
      success: true,
      profile: {
        fullName: user ? user.fullName : '',
        email: user ? user.email : '',
        businessName: user && user.businessName ? user.businessName : '',
        phone: user && user.phone ? user.phone : '',
        address: user && user.address ? user.address : '',
        city: user && user.city ? user.city : '',
        state: user && user.state ? user.state : '',
        zipCode: user && user.zipCode ? user.zipCode : '',
        role: 'CEO & Founder',
        plan: 'Enterprise Tier',
        apiKey: 'pbis_live_sk_8941f7a2d409',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const { fullName, email, businessName, phone, address, city, state, zipCode } = req.body;
    let user = await getTargetUser(req);
    if (!user) {
      user = new User({
        fullName: fullName || 'Business User',
        email: email ? email.toLowerCase().trim() : 'user@bizgrow.com',
        password: '$2a$10$e8w.dummyPasswordHashForGuestAccount',
        businessName: businessName || '',
        phone: phone || '',
        address: address || '',
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
      });
    } else {
      if (fullName !== undefined) user.fullName = fullName;
      if (email !== undefined) user.email = email;
      if (businessName !== undefined) user.businessName = businessName;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
      if (city !== undefined) user.city = city;
      if (state !== undefined) user.state = state;
      if (zipCode !== undefined) user.zipCode = zipCode;
    }
    await user.save();
    res.json({
      success: true,
      message: 'Settings updated successfully',
      profile: {
        fullName: user.fullName,
        email: user.email,
        businessName: user.businessName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
      },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
