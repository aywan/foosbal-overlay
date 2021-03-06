// @flow

import type {StateType} from "../types";

export const defaultState: StateType = {
    isSwitchColor: false,
    isSwitchTeams: false,
    teamLeftName: '',
    teamRightName: '',
    teamLeftScore: 0,
    teamRightScore: 0,
    left: {
        first:'',
        isFirst: false,
        second: '',
        isSecond: false,
        thrid: '',
        isThrid: false,
    },
    right: {
        first:'',
        isFirst: false,
        second: '',
        isSecond: false,
        thrid: '',
        isThrid: false,
    },
    leftGameScore: 0,
    rightGameScore: 0,
};
