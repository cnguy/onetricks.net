import * as mongoose from 'mongoose'
require('dotenv').config()
require('./models')

export const Player = mongoose.model('Player')
export const Stats = mongoose.model('Stats')
export const StatsV4 = mongoose.model('StatsV4')

if (process.env.NODE_ENV === 'development') {
    mongoose.connect('mongodb://mongo:27017/one-tricks')
} else {
    try {
        mongoose.connect(process.env.MONGO_URI!)
    } catch (ex) {
        console.error("Invalid MONGO_URI. Check Dockerfile.")
        process.exit(1)
    }
}