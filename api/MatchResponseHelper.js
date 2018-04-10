// copy-pasted from stats for now (slightly modified)
class MatchResponseHelper {
    static findParticipantIdentity = (match, summonerID) =>
        match.participantIdentities.find(
            ({ player }) =>
                !player
                    ? undefined
                    : player.summonerId === parseInt(summonerID),
        )

    static findParticipant = (match, participantID) =>
        match.participants.find(
            ({ participantId }) => participantId === participantID,
        )

    static didTeamWin = (match, teamID) =>
        didWin(match.teams.find(({ teamId }) => teamId === teamID))

    static getMatchInfoForSummoner = (match, summonerID) => {
        const participantIdentity = MatchResponseHelper.findParticipantIdentity(
            match,
            summonerID,
        )
        if (!participantIdentity) return // undefined edge case
        const { participantId: participantID } = participantIdentity
        const participant = MatchResponseHelper.findParticipant(
            match,
            participantID,
        )
        const { teamId: teamID, spell1Id, spell2Id } = participant
        const { stats } = participant
        const didWin = MatchResponseHelper.didTeamWin(match, teamID)
        const items = [
            stats.item0,
            stats.item1,
            stats.item2,
            stats.item3,
            stats.item4,
            stats.item5,
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
        } = stats

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
            trinket: stats.item6,
            summonerSpells: {
                d: spell1Id,
                f: spell2Id,
            },
            perks,
        }
    }
}

const didWin = ({ win }) => win === 'Win'

export default MatchResponseHelper
