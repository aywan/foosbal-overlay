// @flow

import React, {Component} from 'react';
import styles from './overlay.module.css';

import leftPlayerDoubleIcon from '../../img/player-left-double.svg';
import rightPlayerDoubleIcon from '../../img/player-right-dobule.svg';

import {WsClient, GetWsClient} from "../../services/api";
import type {DypTeamTeam, DypType} from "../../types";

import {Icon} from "semantic-ui-react";

import {PLAYER_LIST, TOURNAMENT} from '../../enums/channels';

const defState = {
    left: {
        color: "red",
        players: ["Антоненко Д.", "Осипова К."],
        sets: [
            {
                state: "win",
                score: 5,
                color: "blue",
            },
            {
                state: "lost",
                score: 3,
                color: "red",
            },
            {
                state: "draw",
                score: 4,
                color: "blue",
            },
            {
                state: "play",
                score: 1,
                color: "red",
            }
        ]
    },
    right: {
        color: "blue",
        players: ["Бюрюков Д."],
        sets: [
            {
                state: "lost",
                score: 2,
                color: "red",
            },
            {
                state: "win",
                score: 5,
                color: "blue",
            },
            {
                state: "draw",
                score: 4,
                color: "red",
            },
            {
                state: "play",
                score: 1,
                color: "blue",
            }
        ]
    },
};

type DypBlockProps = {
    blockPosition: "left" | "right",
    team: DypTeamTeam
}

const setIcons = {
    lost: "thumbs down",
    win: "thumbs up",
    draw: "handshake",
    play: "hand point left",
};

class DypBlock extends Component<DypBlockProps> {
    render () {
        const team = this.props.team;

        let playersIcon, positionStyle, flipIcon;

        if (this.props.blockPosition === "left") {
            playersIcon = leftPlayerDoubleIcon;
            positionStyle = styles.left;
            flipIcon = false;
        } else {
            playersIcon = rightPlayerDoubleIcon;
            positionStyle = styles.right;
            flipIcon = true;
        }

        return (
            <div className={[styles.dypBlock, positionStyle].join(' ')}>
                <div className={styles.sets}>
                    {team.sets.map((set, idx) => {

                        let setClasses: Array = [styles.set];
                        if (set.state !== "play" && idx > 0) {
                            setClasses.push(styles.setInactive);
                        }

                        let scoreClasses: Array = [styles.setScore];
                        if (set.color === "red") {
                            scoreClasses.push(styles.setScoreRed)
                        } else {
                            scoreClasses.push(styles.setScoreBlue)
                        }

                        return (
                            <div key={idx} className={setClasses.join(' ')}>
                                <div className={scoreClasses.join(' ')}>
                                    {set.score}
                                </div>
                                <div className={styles.setType}>
                                    {flipIcon
                                        ? <Icon inverted name={setIcons[set.state]} flipped={"horizontally"} size={"tiny"} color={"grey"}/>
                                        : <Icon inverted name={setIcons[set.state]} size={"tiny"} color={"grey"}/>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.playersBar}>
                    <div className={styles.icon} style={{fill: "red"}}><img src={playersIcon} alt={"left player"}/></div>
                    <div className={styles.players}>
                        <div>{team.players.join(', ')}</div>
                    </div>
                </div>
            </div>
        )
    }
}

class TournamentOverlay extends Component<{}, DypType> {

    client: WsClient;
    state: DypType = {
        left: {
            color: "red",
            players: [],
            sets: [],
        },
        right: {
            color: "blue",
            players: [],
            sets: [],
        }
    };

    constructor () {
        super();
        this.client = GetWsClient();
        this.client.registerComponent(this.updateState, TOURNAMENT);
    }

    componentDidMount (): void {
        this.isMount = true;
        this.client.open();
    }

    componentWillUnmount (): void {
        this.isMount = false;
        this.client.close();
    }

    updateState = (state) => {
        this.setState(state);
    };

    render () {

        return (
            <div className={styles.Overlay}>
                <DypBlock blockPosition={"left"} team={this.state.left}/>
                <DypBlock blockPosition={"right"} team={this.state.right}/>
            </div>
        );
    }
}

export {TournamentOverlay};
