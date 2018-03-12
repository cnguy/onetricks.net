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
        const { gameId: gameID } = match

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
        const { teamId: teamID } = participant
        const { championId: championID } = participant
        const { stats } = participant
        const didWin = MatchResponseHelper.didTeamWin(match, teamID)

        return {
            didWin,
            championID,
            gameID,
        }
    }
}

const didWin = ({ win }) => win === 'Win'

export default MatchResponseHelper
