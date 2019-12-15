import * as mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
    id: Number,
    name: String,
    champ: String,
    rank: String,
    region: String,
})

export interface Player {
    id: string
    name: string
    champ: string
    rank: string
    region: string
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
    summonerId: number
    champions: {
        id: number
        stats: {
            wins: number
            losses: number
            totalSessionsPlayed: number
        }
    }[]
    matchesProcessed: number[]
    region: string
}

const StatsSchemaV4 = new mongoose.Schema({
    summonerId: String,
    accountId: String,
    puuid: String,
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

export interface StatsV4 {
    summonerId: string
    accountId: string
    puuid: string
    champions: {
        id: number
        stats: {
            wins: number
            losses: number
            totalSessionsPlayed: number
        }
    }[]
    matchesProcessed: number[]
    region: string
}

export interface ParticipantStats {
    won: boolean
    items: number[]
    kda: number[]
    perks: number[][]
    perkStyles: number[]
    statPerks: number[]
}

export interface Participant {
    id: number
    championID: number
    spells: number[]
    stats: ParticipantStats
}

export interface ParticipantIdentity {
    id: Number
    accountID: String
    summonerName: String
    summonerID: String
}

export interface MatchV4 {
    gameID: number
    platformID: string
    gameCreation: number
    participants: Participant[]
    participantIdentities: ParticipantIdentity[]
}

const MatchSchemaV4 = new mongoose.Schema({
    gameID: Number,
    platformID: String,
    gameCreation: Number,
    participants: [
        {
            id: Number,
            championID: Number,
            spells: [Number],
            stats: {
                won: Boolean,
                items: [Number],
                kda: [Number],
                perks: [[Number]],
                perkStyles: [Number],
                statPerks: [Number],
            },
        },
    ],
    participantIdentities: [
        {
            id: Number,
            accountID: String,
            summonerName: String,
            summonerID: String,
        },
    ],
})

mongoose.model('Match', MatchSchemaV4)
mongoose.model('Stats', StatsSchema)
mongoose.model('Player', PlayerSchema)
mongoose.model('StatsV4', StatsSchemaV4)
