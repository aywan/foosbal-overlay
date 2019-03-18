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
