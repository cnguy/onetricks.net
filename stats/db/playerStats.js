import mongoose from 'mongoose';

// PlayerStatsSchema represents a single entity in
// the Stats[region] table.
const PlayerStatsSchema = new mongoose.Schema({
    region: String,
    summonerId: Number,
    champions: [
        {
            id: Number,
            stats: {
                wins: Number,
                losses: Number,
                totalSessionsPlayed: Number, // "backwards compatability"
            },
        },
    ],
    matchesProcessed: Number,
});

mongoose.model('PlayerStats', PlayerStatsSchema);
