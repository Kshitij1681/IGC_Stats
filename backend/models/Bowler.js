import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  matches: { type: Number, default: 0, min: 0 },
  overs: { type: Number, default: 0, min: 0 },
  wickets: { type: Number, default: 0, min: 0 },
  runsConceded: { type: Number, default: 0, min: 0 },
  wicketHauls: { type: Number, default: 0, min: 0 } // 3+ wicket hauls
}, { _id: false });

const bowlerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bowler name is required'],
    trim: true
  },
  jerseyNumber: {
    type: Number,
    required: [true, 'Jersey number is required'],
    unique: true
  },
  role: {
    type: String,
    enum: ['Fast', 'Medium', 'Spin', 'Medium-Fast', 'Leg-Spin', 'Off-Spin'],
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  homeStats: {
    type: statsSchema,
    default: () => ({})
  },
  awayStats: {
    type: statsSchema,
    default: () => ({})
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Virtual: computed overall stats
bowlerSchema.virtual('overallStats').get(function() {
  const matches = (this.homeStats.matches || 0) + (this.awayStats.matches || 0);
  const overs = (this.homeStats.overs || 0) + (this.awayStats.overs || 0);
  const wickets = (this.homeStats.wickets || 0) + (this.awayStats.wickets || 0);
  const runsConceded = (this.homeStats.runsConceded || 0) + (this.awayStats.runsConceded || 0);
  const wicketHauls = (this.homeStats.wicketHauls || 0) + (this.awayStats.wicketHauls || 0);

  const economy = overs > 0 ? parseFloat((runsConceded / overs).toFixed(2)) : 0;
  const strikeRate = wickets > 0 ? parseFloat(((overs * 6) / wickets).toFixed(2)) : 0;

  return { matches, overs, wickets, runsConceded, wicketHauls, economy, strikeRate };
});

// Compute economy and strike rate for each stat set
bowlerSchema.methods.getComputedStats = function(type) {
  const stats = type === 'home' ? this.homeStats : this.awayStats;
  const economy = stats.overs > 0 ? parseFloat((stats.runsConceded / stats.overs).toFixed(2)) : 0;
  const strikeRate = stats.wickets > 0 ? parseFloat(((stats.overs * 6) / stats.wickets).toFixed(2)) : 0;
  return { ...stats.toObject(), economy, strikeRate };
};

bowlerSchema.set('toJSON', { virtuals: true });
bowlerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Bowler', bowlerSchema);
