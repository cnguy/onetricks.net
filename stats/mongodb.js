import mongoose from 'mongoose'
require('./models')

export const Stats = mongoose.model('Stats')
export const parseStats = ({
    summonerId,
    region,
    champions,
    matchesProcessed,
}) => ({
    summonerId,
    region,
    champions,
    matchesProcessed,
})

if (process.env.NODE_ENV === 'development') {
    mongoose.connect('mongodb://mongo:27017/one-tricks')
} else {
    try {
        mongoose.connect(process.env.MONGO_URI)
    } catch (ex) {
        console.error('exception..:', ex)
    }
}
