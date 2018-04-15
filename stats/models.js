import mongoose from 'mongoose'

const StatsSchema = new mongoose.Schema({
    summonerId: Number,
    champions: [
        {
            id: Number,
            stats: {
                wins: Number,
                losses: Number,
                totalSessionsPlayed: Number,
            },
        },
    ],
    matchesProcessed: [Number],
    region: String,
})

mongoose.model('Stats', StatsSchema)
