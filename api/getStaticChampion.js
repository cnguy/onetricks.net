import jsonfile from 'jsonfile'

const staticChampions = jsonfile.readFileSync('./static_champions.json')

// Cached Static Champion keys for getStaticChampion.
const staticChampionKeys = Object.keys(staticChampions.data)

/**
 * getStaticChampion replaces the need for kayn.Static.Champion.get which gets
 * rate limited very easily.
 * @param {number} id - The ID of the champion in `https://ddragon.leagueoflegends.com/cdn/7.24.2/data/en_US/champion.json`.
 * @returns {object} the static champion object (pretty much always.
 */
const getStaticChampion = id => {
    const targetKey = staticChampionKeys.find(
        key => parseInt(staticChampions.data[key].id) === id,
    )
    return staticChampions.data[targetKey]
    // It should always return.
}

export const getStaticChampionByName = name => {
    const targetKey = staticChampionKeys.find(key => {
        if (
            staticChampions.data[key].key === 'MonkeyKing' &&
            name === 'Wukong'
        ) {
            return true
        }
        return (
            staticChampions.data[key].key.toLowerCase() === name.toLowerCase()
        )
    })
    return staticChampions.data[targetKey]
}

export default getStaticChampion
