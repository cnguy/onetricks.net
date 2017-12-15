import mongoose from 'mongoose';

// PlayerStatsSchema represents a single entity in
// the Stats[region] table.
const PlayerStatsSchema = new mongoose.Schema({
  summonerId: Number,
  champions: [{
    
  }],
  matchesProcessed: Number,
});

mongoose.model('PlayerStats', PlayerStatsSchema);