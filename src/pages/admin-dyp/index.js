// @flow

import React, {Component} from 'react';
import styles from './admin-dyp.module.css';
import 'semantic-ui-css/semantic.min.css'
import {Form, Grid, Rating, Dropdown, Button, Modal} from "semantic-ui-react";
import {GetWsClient, WsClient} from "./../../services/api";

import type {AdminDypStateType, DypSetType} from "../../types";

import {PLAYER_LIST, TOURNAMENT} from '../../enums/channels';

const TeamColor = ({color}) => {
    if (color === "red") {
        return (<span style={{color: "red"}}>RED</span>);
    } else {
        return (<span style={{color: "blue"}}>BLUE</span>);
    }
};

const toggleColor = (color) => color === "red" ? "blue" : "red";

const setStateList = [
    "play",
    "draw",
    "win",
    "lost"
];

const setStateOptions = setStateList.map((state) => ({
    key: state,
    text: state,
    value: state,
}));

class AdminPage extends Component<{}, AdminDypStateType> {
    isMount: boolean = false;
    client: WsClient;

    state: AdminDypStateType = {
        playerList: [],
        left: {
            color: "red",
            players: [],
            sets: []
        },
        right: {
            color: "blue",
            players: [],
            sets: []
        },
        modalPlayers: '',
    };

    constructor () {
        super();
        this.client = GetWsClient();
        this.client.registerComponent(this.updateClientCallback, TOURNAMENT);
        this.client.registerComponent(this.updatePlayerList, PLAYER_LIST);
    }

    componentDidMount (): void {
        this.isMount = true;
        this.client.open();
    }

    componentWillUnmount (): void {
        this.isMount = false;
        this.client.close();
    }

    updatePlayerList = (list) => {
        this.setState({
            ...this.state,
            playerList: list,
        });
    };

    updateClientCallback = (state) => {
        let newState: AdminDypStateType = {
            ...this.state,
            left: state.left,
            right: state.right
        };
        this.setState(newState);
    };

    handleGameSubmit = () => {
        this.client.sendPatch({
            left: this.state.left,
            right: this.state.right,
        }, TOURNAMENT);
    };

    handleSwitchColor = () => {
        let newState: AdminDypStateType = {...this.state};
        newState.left.color = toggleColor(newState.left.color);
        newState.right.color = toggleColor(newState.right.color);
        this.setState(newState);
    };

    handleSwitchTeam = () => {
        this.setState({
            ...this.state,
            left: {
                color: this.state.left.color,
                players: this.state.right.players,
                sets: this.state.right.sets,
            },
            right: {
                color: this.state.right.color,
                players: this.state.left.players,
                sets: this.state.left.sets,
            }
        });
    };

    switchSetState = (value: string, idx: string, isLeft: boolean) => {
        let prim, sec;
        if (isLeft) {
            prim = this.state.left.sets[idx].state;
            sec = this.state.right.sets[idx].state;
        } else {
            prim = this.state.right.sets[idx].state;
            sec = this.state.left.sets[idx].state;
        }

        console.log(value, prim, sec);

        switch (value) {
            case "draw":
            case "play":
                prim = value;
                sec = value;
                break;

            case "win":
                prim = "win";
                sec = "lost";
                break;

            case "lost":
                prim = "lost";
                sec = "win";
                break;

            default:
        }

        let newState = {...this.state};

        if (isLeft) {
            newState.left.sets[idx].state = prim;
            newState.right.sets[idx].state = sec;
        } else {
            newState.right.sets[idx].state = prim;
            newState.left.sets[idx].state = sec;
        }

        this.setState(newState);
    };

    setSetRating = (idx: number, rating: number, isLeft: number) => {
        let newState: AdminDypStateType = {...this.state};

        if (isLeft) {
            newState.left.sets[idx].score = rating;
        } else {
            newState.right.sets[idx].score = rating;
        }

        this.setState(newState);
    };

    removeSet = (idx: number) => {
        let newState: AdminDypStateType = {...this.state};

        newState.left.sets.splice(idx, 1);
        newState.right.sets.splice(idx, 1);

        this.setState(newState);
    };

    addNewSet = () => {
        let newState: AdminDypStateType = {...this.state};

        newState.left.sets.push({
            state: "play",
            color: this.state.left.color,
            score: 0,
        });

        newState.right.sets.push({
            state: "play",
            color: this.state.right.color,
            score: 0,
        });

        this.setState(newState);
    };

    resetState = () => {
        this.setState({
            ...this.state,
            left: {
                color: this.state.left.color,
                players: [],
                sets: [],
            },
            right: {
                color: this.state.right.color,
                players: [],
                sets: [],
            }
        });
    };

    getPlayersList = (isLeft) => {
        const exists = isLeft ? this.state.right.players : this.state.left.players;

        return this.state.playerList
            .filter((e) => !exists.includes(e))
            .map((e) => ({
                key: e,
                text: e,
                value: e,
            }));
    };

    selectPlayerList = (value: Array<string>, isLeft: boolean) => {
        let newState: AdminDypStateType = {...this.state};

        if (isLeft) {
            newState.left.players = value;
        } else {
            newState.right.players = value;
        }
        this.setState(newState);
    };

    handlePlayerList = (value: string) => {
        const list = value.split("\n").map((s) => s.trim()).filter((s) => !!s);
        this.setState({
            ...this.state,
            playerList: list,
        });
        this.client.sendPatch(list, PLAYER_LIST);
    };

    updateModalPlayers = (value) => this.setState({...this.state, modalPlayers: value});

    handleOpenModal = () => {
        this.setState({
            ...this.state,
            modalPlayers: this.state.playerList.join("\n"),
        })
    };

    render () {
        return (
            <div className={styles.AdminPage}>

                {/* Controlls */}
                <Grid columns={1} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <Button onClick={this.handleSwitchColor}>Switch color</Button>
                            <Button onClick={this.handleSwitchTeam}>Switch teams</Button>

                            <Modal
                                trigger={<Button>Player list</Button>}
                                onOpen={() => this.handleOpenModal()}
                                onClose={() => this.handlePlayerList(this.state.modalPlayers)}
                            >
                                <Modal.Header>Player list</Modal.Header>
                                <Modal.Content key={"modalContent"}>
                                    <Form>
                                        <Form.TextArea
                                            value={this.state.modalPlayers}
                                            onChange={(e,{value}) => this.updateModalPlayers(value)}
                                        />
                                    </Form>
                                </Modal.Content>
                            </Modal>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <hr/>

                <Form>
                    {/* teams */}
                    <h2>Teams</h2>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column>
                                <h3>Team Left: <TeamColor color={this.state.left.color}/></h3>
                                <Dropdown
                                    fluid
                                    multiple
                                    search
                                    selection
                                    clearable
                                    options={this.getPlayersList(true)}
                                    value={this.state.left.players}
                                    onChange={(e, {value}) => this.selectPlayerList(value, true)}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <h3>Team Right: <TeamColor color={this.state.right.color}/></h3>
                                <Dropdown
                                    fluid
                                    multiple
                                    search
                                    selection
                                    clearable
                                    options={this.getPlayersList(false)}
                                    value={this.state.right.players}
                                    onChange={(e, {value}) => this.selectPlayerList(value, false)}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <hr/>

                    {/* sets */}
                    <h2>Sets</h2>

                    {this.state.left.sets.map((set, idx) => {
                        const leftSet: DypSetType = set;
                        const rightSet: DypSetType = this.state.right.sets[idx];

                        return (
                            <React.Fragment>
                                <Grid columns={2} divided key={idx}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <h4>
                                                <TeamColor color={leftSet.color}/>{' '}
                                                <Dropdown
                                                    inline
                                                    options={setStateOptions}
                                                    value={leftSet.state}
                                                    onChange={(e, {value}) => this.switchSetState(value, idx, true)}
                                                />
                                            </h4>
                                            <Rating
                                                maxRating={5}
                                                clearable
                                                rating={leftSet.score}
                                                onRate={(e, {rating}) => this.setSetRating(idx, rating, true)}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <h4>
                                                <TeamColor color={rightSet.color}/>{' '}
                                                <Dropdown
                                                    inline
                                                    options={setStateOptions}
                                                    value={rightSet.state}
                                                    onChange={(e, {value}) => this.switchSetState(value, idx, false)}
                                                />
                                            </h4>
                                            <Rating
                                                maxRating={5}
                                                clearable
                                                rating={rightSet.score}
                                                onRate={(e, {rating}) => this.setSetRating(idx, rating, false)}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={1}>
                                        <Grid.Column>
                                            <Form.Button color="purple" compact onClick={() => this.removeSet(idx)}>Remove set</Form.Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <hr/>
                            </React.Fragment>
                        )
                    })}

                    {/* controls */}
                    <Form.Group>
                        <Form.Button color="green" onClick={this.addNewSet}>New set</Form.Button>
                        <Form.Button color="red" onClick={this.handleGameSubmit}>Save</Form.Button>
                        <Form.Button color="red" inverted onClick={this.resetState}>Reset</Form.Button>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export {AdminPage};
