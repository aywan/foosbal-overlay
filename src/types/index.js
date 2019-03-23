// @flow

export type TeamType = {
    first: string,
    isFirst: boolean,
    second: string,
    isSecond: boolean,
    thrid: string,
    isThrid: boolean,
}

export type StateType = {
    isSwitchColor: boolean,
    isSwitchTeams: boolean,
    teamLeftName: string,
    teamRightName: string,
    teamLeftScore: number,
    teamRightScore: number,
    left: TeamType,
    right: TeamType,
    leftGameScore: number,
    rightGameScore: number,
}

type TeamColor = "red" | "blue";

export type DypSetType = {
    state: "win" | "lost" | "draw" | "play",
    score: number,
    color: TeamColor,
}

export type DypTeamTeam = {
    color: TeamColor,
    players: Array<string>,
    sets: Array<DypSetType>
}

export type DypType = {
    left: DypTeamTeam,
    right: DypTeamTeam,
}

export type AdminDypStateType = {
    playerList: Array<string>
    left: DypTeamTeam
    right: DypTeamTeam
    modalPlayers: string,
}
