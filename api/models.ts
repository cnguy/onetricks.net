import * as mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
    id: Number,
    name: String,
    champ: String,
    rank: String,
    region: String,
})

export interface Player {
    id: number,
    name: string,
    champ: string,
    rank: string,
    region: string,
}

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

export interface Stats {
    summonerId: number,
    champions: {
        id: number,
        stats: {
            wins: number,
            losses: number,
            totalSessionsPlayed: number
        }
    }[],
    matchesProcessed: number[]
    region: string
}

mongoose.model('Stats', StatsSchema)
mongoose.model('Player', PlayerSchema)
