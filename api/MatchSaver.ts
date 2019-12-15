import kayn from './kayn'
// @ts-ignore
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper'

const { asPlatformID } = RegionHelper

import { Match } from './mongodb'

import asyncMapOverArrayInChunks from './utils/generic/asyncMapOverArrayInChunks'
import asyncForEach from './utils/generic/asyncForEach'

import MatchlistKaynHelper from './utils/kayn-dependent/MatchlistKaynHelper'
import {
    MatchV4MatchDto,
    SummonerV4SummonerDTO,
    LeagueV4LeagueListDTO,
    MatchV4ParticipantDto,
    MatchV4ParticipantIdentityDto,
} from 'kayn/typings/dtos'
import { MatchV4, Participant, ParticipantIdentity } from './models'
import { REGIONS } from 'kayn'

require('dotenv').config()

const LEAGUE_QUEUE = 'RANKED_SOLO_5x5'

// Local Helpers

const inPlatform = (region: string) => ({
    platformId: platformID,
}: MatchV4MatchDto) => platformID!.toLowerCase() === asPlatformID(region)

const leagueMatchToDatabaseObject = (match: MatchV4MatchDto): MatchV4 => ({
    gameID: match.gameId!,
    platformID: match.platformId!,
    gameCreation: match.gameCreation!,
    participants: match.participants!.map(
        (participant: MatchV4ParticipantDto): Participant => ({
            id: participant.participantId!,
            championID: participant.championId!,
            spells: [participant.spell1Id!, participant.spell2Id!],
            stats: {
                won: participant.stats!.win!,
                items: [
                    participant.stats!.item0!,
                    participant.stats!.item1!,
                    participant.stats!.item2!,
                    participant.stats!.item3!,
                    participant.stats!.item4!,
                    participant.stats!.item5!,
                    participant.stats!.item6!,
                ],
                kda: [
                    participant.stats!.kills!,
                    participant.stats!.deaths!,
                    participant.stats!.assists!,
                ],
                perks: [
                    [
                        participant.stats!.perk0!,
                        participant.stats!.perk0Var1!,
                        participant.stats!.perk0Var2!,
                        participant.stats!.perk0Var3!,
                    ],
                    [
                        participant.stats!.perk1!,
                        participant.stats!.perk1Var1!,
                        participant.stats!.perk1Var2!,
                        participant.stats!.perk1Var3!,
                    ],
                    [
                        participant.stats!.perk2!,
                        participant.stats!.perk2Var1!,
                        participant.stats!.perk2Var2!,
                        participant.stats!.perk2Var3!,
                    ],
                    [
                        participant.stats!.perk3!,
                        participant.stats!.perk3Var1!,
                        participant.stats!.perk3Var2!,
                        participant.stats!.perk3Var3!,
                    ],
                    [
                        participant.stats!.perk4!,
                        participant.stats!.perk4Var1!,
                        participant.stats!.perk4Var2!,
                        participant.stats!.perk4Var3!,
                    ],
                    [
                        participant.stats!.perk5!,
                        participant.stats!.perk5Var1!,
                        participant.stats!.perk5Var2!,
                        participant.stats!.perk5Var3!,
                    ],
                ],
                perkStyles: [
                    participant.stats!.perkPrimaryStyle!,
                    participant.stats!.perkSubStyle! || -1,
                ],
                // TODO: Temporary hack due to no DTO in `kayn`. Requires a rebuild.
                statPerks: [
                    ((participant.stats! as any).statPerk0 as number) || 0,
                    ((participant.stats! as any).statPerk1 as number) || 0,
                    ((participant.stats! as any).statPerk2 as number) || 0,
                ],
            },
        }),
    ),
    participantIdentities: match.participantIdentities!.map(
        (
            participantIdentity: MatchV4ParticipantIdentityDto,
        ): ParticipantIdentity => ({
            id: participantIdentity.participantId!,
            accountID: participantIdentity.player!.accountId!,
            summonerName: participantIdentity.player!.summonerName!,
            summonerID: participantIdentity.player!.summonerId!,
        }),
    ),
})

const processMatchlist = async (accountID: string, region: string) => {
    const fullListOfMatchIDs = (await MatchlistKaynHelper.getEntireMatchlist(
        kayn,
    )(accountID, region))!
        .filter(inPlatform(region))
        .map((match: MatchV4MatchDto) => match!.gameId!)

    const filteredMatches: number[] = []

    await asyncForEach(fullListOfMatchIDs, async (matchID: number) => {
        const count = await Match.count({
            gameID: matchID,
            platformID: RegionHelper.asPlatformID(region).toUpperCase(),
        }).exec()
        if (count == 0) {
            filteredMatches.push(matchID)
        }
    })

    const matches = await MatchlistKaynHelper.rawMatchlistToMatches(kayn)(
        filteredMatches,
        region,
    )

    const simplifiedMatches: MatchV4[] = matches.map(
        leagueMatchToDatabaseObject,
    )

    console.log(
        accountID,
        region,
        'inserting',
        simplifiedMatches.length,
        'out of',
        fullListOfMatchIDs.length,
    )
    const _ = await Match.insertMany(simplifiedMatches)

    return true
}

const processPlayers = async (
    region: string,
    summoners: SummonerV4SummonerDTO[],
) => {
    const summonersChunkSize = summoners.length / summoners.length

    await asyncMapOverArrayInChunks(
        summoners,
        summonersChunkSize,
        async ({ accountId: accountID }: SummonerV4SummonerDTO) => {
            try {
                await processMatchlist(accountID!, region)
            } catch (exception) {
                console.error(exception)
            }
        },
    )

    return true
}

const processLeagues = async (rank: string, region: string) => {
    const league: LeagueV4LeagueListDTO = await (kayn as any)[rank]
        .list(LEAGUE_QUEUE)
        .region(region)
    const summonerIDs = league!.entries!.map(entry => entry!.summonerId!)
    const getSummonerByRegion = async (id: string) =>
        kayn.Summoner.by.id(id).region(region)
    const summonerPromises = summonerIDs.map(getSummonerByRegion)
    const summoners = await Promise.all(summonerPromises)
    const _ = await processPlayers(region, summoners)
    return true
}

// Get Challenger, Masters, & Grandmasters league.
const processChunk = async (REGIONS: any, rank: string, chunk: string[]) =>
    Promise.all(chunk.map(r => processLeagues(rank, REGIONS[r])))

const main = async () => {
    const keys = Object.keys(REGIONS)
    await processChunk(REGIONS, 'Challenger', keys)
    return true
}

export default main
