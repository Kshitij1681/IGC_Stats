import express from 'express';
import Bowler from '../models/Bowler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route GET /api/admin/bowlers
// @desc Get all bowlers (including inactive)
router.get('/bowlers', async (req, res) => {
  try {
    const bowlers = await Bowler.find().sort({ name: 1 });
    res.json({ success: true, count: bowlers.length, bowlers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/admin/bowlers
// @desc Add new bowler
router.post('/bowlers', async (req, res) => {
  try {
    const { name, jerseyNumber, role, avatar } = req.body;

    const existing = await Bowler.findOne({ jerseyNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Jersey number already taken' });
    }

    const bowler = await Bowler.create({
      name,
      jerseyNumber,
      role,
      avatar: avatar || '',
      homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 }
    });

    res.status(201).json({ success: true, bowler });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/bowlers/:id
// @desc Update bowler info & stats
router.put('/bowlers/:id', async (req, res) => {
  try {
    const { name, jerseyNumber, role, avatar, homeStats, awayStats, isActive } = req.body;

    const bowler = await Bowler.findById(req.params.id);
    if (!bowler) return res.status(404).json({ success: false, message: 'Bowler not found' });

    // Check jersey conflict
    if (jerseyNumber && jerseyNumber !== bowler.jerseyNumber) {
      const conflict = await Bowler.findOne({ jerseyNumber, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(400).json({ success: false, message: 'Jersey number already taken' });
      }
    }

    if (name !== undefined) bowler.name = name;
    if (jerseyNumber !== undefined) bowler.jerseyNumber = jerseyNumber;
    if (role !== undefined) bowler.role = role;
    if (avatar !== undefined) bowler.avatar = avatar;
    if (isActive !== undefined) bowler.isActive = isActive;

    if (homeStats) {
      bowler.homeStats = { ...bowler.homeStats.toObject(), ...homeStats };
    }
    if (awayStats) {
      bowler.awayStats = { ...bowler.awayStats.toObject(), ...awayStats };
    }

    await bowler.save();
    res.json({ success: true, bowler });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route PATCH /api/admin/bowlers/:id/stats
// @desc Update only stats for a bowler
router.patch('/bowlers/:id/stats', async (req, res) => {
  try {
    const { type, stats } = req.body; // type: 'home' | 'away'

    if (!['home', 'away'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be home or away' });
    }

    const bowler = await Bowler.findById(req.params.id);
    if (!bowler) return res.status(404).json({ success: false, message: 'Bowler not found' });

    const field = type === 'home' ? 'homeStats' : 'awayStats';
    bowler[field] = { ...bowler[field].toObject(), ...stats };
    await bowler.save();

    res.json({ success: true, message: `${type} stats updated`, bowler });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/admin/bowlers/:id
// @desc Soft delete bowler
router.delete('/bowlers/:id', async (req, res) => {
  try {
    const bowler = await Bowler.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!bowler) return res.status(404).json({ success: false, message: 'Bowler not found' });
    res.json({ success: true, message: 'Bowler deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
