import * as jsonfile from 'jsonfile'

const staticChampions = jsonfile.readFileSync('./static_champions.json')

// Cached Static Champion keys for getStaticChampion.
const staticChampionKeys = Object.keys(staticChampions.data)

/**
 * getStaticChampion replaces the need for kayn.Static.Champion.get which gets
 * rate limited very easily.
 */
const getStaticChampion = (id: number): any => {
    const targetKey = staticChampionKeys.find(
        key => parseInt(staticChampions.data[key].id) === id,
    )!
    return staticChampions.data[targetKey]
    // It should always return.
}

export const getStaticChampionByName = (name: string): any => {
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
    return staticChampions.data[targetKey!]
}

export default getStaticChampion
