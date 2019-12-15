import {
    MatchV4MatchDto,
    MatchV4TeamStatsDto,
    MatchV4ParticipantDto,
} from 'kayn/typings/dtos'

class MatchResponseHelper {
    static findParticipantIdentity = (
        match: MatchV4MatchDto,
        summonerID: string,
    ) =>
        match!.participantIdentities!.find(
            ({ player }) =>
                !player ? false : player.summonerId === summonerID,
        )

    static findParticipant = (match: MatchV4MatchDto, participantID: number) =>
        match!.participants!.find(
            ({ participantId }) => participantId === participantID,
        )

    static didTeamWin = (match: MatchV4MatchDto, teamID: number): boolean =>
        didWin(match!.teams!.find(({ teamId }) => teamId === teamID)!)

    static getChampionWin = (match: MatchV4MatchDto, summonerID: string) => {
        const { gameId: gameID } = match

        const participantIdentity = MatchResponseHelper.findParticipantIdentity(
            match,
            summonerID,
        )
        if (!participantIdentity) return // undefined edge case
        const { participantId: participantID } = participantIdentity
        const participant = MatchResponseHelper.findParticipant(
            match,
            participantID!,
        )
        const { teamId: teamID, championId: championID, stats } = participant!
        const didWin = MatchResponseHelper.didTeamWin(match, teamID!)

        return {
            didWin,
            championID,
            gameID,
        }
    }

    static getMatchInfoForSummoner = (
        match: MatchV4MatchDto,
        summonerID: string,
    ) => {
        const participantIdentity = MatchResponseHelper.findParticipantIdentity(
            match,
            summonerID,
        )
        if (!participantIdentity) return // undefined edge case
        const { participantId: participantID } = participantIdentity
        const participant = MatchResponseHelper.findParticipant(
            match,
            participantID as number,
        )
        const {
            teamId: teamID,
            spell1Id,
            spell2Id,
        } = participant as MatchV4ParticipantDto
        const { stats } = participant as MatchV4ParticipantDto
        const didWin = MatchResponseHelper.didTeamWin(match, teamID!)
        const items = [
            stats!.item0,
            stats!.item1,
            stats!.item2,
            stats!.item3,
            stats!.item4,
            stats!.item5,
        ]
        const {
            perk0,
            perk0Var1,
            perk0Var2,
            perk0Var3,
            perk1,
            perk1Var1,
            perk1Var2,
            perk1Var3,
            perk2,
            perk2Var1,
            perk2Var2,
            perk2Var3,
            perk3,
            perk3Var1,
            perk3Var2,
            perk3Var3,
            perk4,
            perk4Var1,
            perk4Var2,
            perk4Var3,
            perk5,
            perk5Var1,
            perk5Var2,
            perk5Var3,
            perkPrimaryStyle,
            perkSubStyle,
            kills,
            deaths,
            assists,
        } = stats as any
        // MatchV3ParticipantStatsDto does not have perks yet (Riot has not updated their docs)

        const perks = {
            perk0,
            perk0Var1,
            perk0Var2,
            perk0Var3,
            perk1,
            perk1Var1,
            perk1Var2,
            perk1Var3,
            perk2,
            perk2Var1,
            perk2Var2,
            perk2Var3,
            perk3,
            perk3Var1,
            perk3Var2,
            perk3Var3,
            perk4,
            perk4Var1,
            perk4Var2,
            perk4Var3,
            perk5,
            perk5Var1,
            perk5Var2,
            perk5Var3,
            perkPrimaryStyle,
            perkSubStyle,
        }

        return {
            kda: {
                kills,
                deaths,
                assists,
            },
            didWin,
            items,
            trinket: stats!.item6,
            summonerSpells: {
                d: spell1Id,
                f: spell2Id,
            },
            perks,
        }
    }
}

const didWin = ({ win }: MatchV4TeamStatsDto): boolean => win === 'Win'

export default MatchResponseHelper
