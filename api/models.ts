import * as mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema({
    id: Number,
    name: String,
    champ: String,
    rank: String,
    region: String,
})

mongoose.model('Player', PlayerSchema)
