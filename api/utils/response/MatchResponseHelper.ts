import { MatchV3MatchDto, MatchV3TeamStatsDto } from "kayn/typings/dtos";

class MatchResponseHelper {
    static findParticipantIdentity = (match: MatchV3MatchDto, summonerID: number) =>
        match.participantIdentities!.find(
            ({ player }: any) =>
                !player
                    ? false
                    : player.summonerId === summonerID,
        )

    static findParticipant = (match: MatchV3MatchDto, participantID: number) =>
        match.participants!.find(
            ({ participantId }) => participantId === participantID,
        )

    static didTeamWin = (match: MatchV3MatchDto, teamID: number) =>
        didWin(match.teams!.find(({ teamId }) => teamId === teamID)!)

    static getMatchInfoForSummoner = (match: MatchV3MatchDto, summonerID: number) => {
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
}

const didWin = ({ win }: MatchV3TeamStatsDto) => win === 'Win'

export default MatchResponseHelper
