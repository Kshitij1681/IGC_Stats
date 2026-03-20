import express from 'express';
import BowlerOfWeek from '../models/BowlerOfWeek.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/bowler-of-week/current
// @desc Get current bowler of the week
router.get('/current', async (req, res) => {
  try {
    const current = await BowlerOfWeek.findOne()
      .sort({ weekStartDate: -1 })
      .populate('bowler');

    if (!current) {
      return res.json({ success: true, bowlerOfWeek: null });
    }

    res.json({ success: true, bowlerOfWeek: current });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/bowler-of-week/history
// @desc Get past bowler of week history
router.get('/history', async (req, res) => {
  try {
    const history = await BowlerOfWeek.find()
      .sort({ weekStartDate: -1 })
      .limit(10)
      .populate('bowler');

    res.json({ success: true, count: history.length, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/bowler-of-week
// @desc Announce bowler of the week (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { bowlerId, weekStartDate, weekEndDate, reason, highlights } = req.body;

    const bowlerOfWeek = await BowlerOfWeek.create({
      bowler: bowlerId,
      weekStartDate: new Date(weekStartDate),
      weekEndDate: new Date(weekEndDate),
      reason,
      highlights: highlights || {},
      announcedAt: new Date()
    });

    const populated = await bowlerOfWeek.populate('bowler');
    res.status(201).json({ success: true, bowlerOfWeek: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/bowler-of-week/:id
// @desc Remove a bowler of week announcement
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await BowlerOfWeek.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
