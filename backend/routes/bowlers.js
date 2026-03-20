import express from 'express';
import Bowler from '../models/Bowler.js';

const router = express.Router();

// Helper: compute stats with economy & strike rate
const computeStats = (stats) => {
  const economy = stats.overs > 0 ? parseFloat((stats.runsConceded / stats.overs).toFixed(2)) : 0;
  const strikeRate = stats.wickets > 0 ? parseFloat(((stats.overs * 6) / stats.wickets).toFixed(2)) : 0;
  return { ...stats, economy, strikeRate };
};

const formatBowler = (bowler) => {
  const home = computeStats(bowler.homeStats.toObject ? bowler.homeStats.toObject() : bowler.homeStats);
  const away = computeStats(bowler.awayStats.toObject ? bowler.awayStats.toObject() : bowler.awayStats);
  const overall = bowler.overallStats;
  return {
    _id: bowler._id,
    name: bowler.name,
    jerseyNumber: bowler.jerseyNumber,
    role: bowler.role,
    avatar: bowler.avatar,
    isActive: bowler.isActive,
    homeStats: home,
    awayStats: away,
    overallStats: overall,
    createdAt: bowler.createdAt,
    updatedAt: bowler.updatedAt
  };
};

// @route GET /api/bowlers
// @desc Get all active bowlers
router.get('/', async (req, res) => {
  try {
    const bowlers = await Bowler.find({ isActive: true }).sort({ name: 1 });
    const formatted = bowlers.map(formatBowler);
    res.json({ success: true, count: formatted.length, bowlers: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/bowlers/rankings
// @desc Get bowlers ranked by wickets > economy > strike rate
router.get('/rankings', async (req, res) => {
  try {
    const bowlers = await Bowler.find({ isActive: true });
    const formatted = bowlers.map(formatBowler);

    // Sort: wickets DESC, economy ASC (lower is better), strikeRate ASC
    const ranked = formatted.sort((a, b) => {
      const aStats = a.overallStats;
      const bStats = b.overallStats;

      if (bStats.wickets !== aStats.wickets) return bStats.wickets - aStats.wickets;

      const aEco = aStats.economy || 999;
      const bEco = bStats.economy || 999;
      if (aEco !== bEco) return aEco - bEco;

      const aSR = aStats.strikeRate || 999;
      const bSR = bStats.strikeRate || 999;
      return aSR - bSR;
    });

    const withRank = ranked.map((b, i) => ({ ...b, rank: i + 1 }));
    res.json({ success: true, count: withRank.length, bowlers: withRank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/bowlers/:id
// @desc Get single bowler
router.get('/:id', async (req, res) => {
  try {
    const bowler = await Bowler.findById(req.params.id);
    if (!bowler) return res.status(404).json({ success: false, message: 'Bowler not found' });
    res.json({ success: true, bowler: formatBowler(bowler) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
