import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ignou_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route POST /api/auth/register-admin
// @desc Register admin (requires setup key)
router.post('/register-admin', async (req, res) => {
  try {
    const { username, password, setupKey } = req.body;

    if (setupKey !== (process.env.ADMIN_SETUP_KEY || 'IGNOU_ADMIN_2024')) {
      return res.status(403).json({ success: false, message: 'Invalid setup key' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const user = await User.create({ username, password, role: 'admin' });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/auth/login
// @desc Login user (admin)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/auth/me
// @desc Get current user
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, username: req.user.username, role: req.user.role }
  });
});

export default router;
