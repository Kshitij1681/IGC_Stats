import mongoose from 'mongoose';

const bowlerOfWeekSchema = new mongoose.Schema({
  bowler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bowler',
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for selection is required'],
    trim: true
  },
  highlights: {
    wicketsTaken: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 }
  },
  announcedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('BowlerOfWeek', bowlerOfWeekSchema);
