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

mongoose.model('Player', PlayerSchema)
