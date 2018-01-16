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
}

const didWin = ({ win }) => win === 'Win'

export default MatchResponseHelper
