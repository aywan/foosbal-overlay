// @flow
import React, {Component} from 'react';
import './App.css';
import {Form, Grid} from "semantic-ui-react";

import type {StateType} from "./types";

import {WsClient} from "./api";

const defState: StateType = {
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

class App extends Component<{}, StateType> {
    isMount: boolean = false;
    client: WsClient;

    state: StateType = defState;

    constructor () {
        super();
        this.client = new WsClient(this);
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

    handleConfigSubmit = () => {
        const state = {
            ...this.client.getState(),
            isSwitchTeams: this.state.isSwitchTeams,
            isSwitchColor: this.state.isSwitchColor,
        };

        this.client.sendPatch(state);
    };

    handleTeamSubmit = () => {
        const state = {
            ...this.client.getState(),
            teamLeftName: this.state.teamLeftName,
            teamLeftScore: this.state.teamLeftScore,
            teamRightName: this.state.teamRightName,
            teamRightScore: this.state.teamRightScore,
        };

        this.client.sendPatch(state);
    };

    handlePlayersSubmit = () => {
        const state = {
            ...this.client.getState(),
            left: this.state.left,
            right: this.state.right,
        };

        this.client.sendPatch(state);
    };

    handleGameSubmit = () => {
        const state = {
            ...this.client.getState(),
            leftGameScore: this.state.leftGameScore,
            rightGameScore: this.state.rightGameScore,
        };

        this.client.sendPatch(state);
    };

    handleChangeValue = (e, {name, value}) => this.setState({[name]: value});
    handleChangeValueSub = (sub) => (e, {name, value}) => this.setState({[sub]: {...this.state[sub], [name]: value}});
    handleChangeChecked = (e, {name, checked}) => this.setState({[name]: checked});
    handleChangeCheckedSub = (sub) => (e, {name, checked}) => this.setState({[sub]: {...this.state[sub], [name]: checked}});

    render () {
        return (
            <div className="App">
                <Form>
                    {/* controls */}
                    <h2>Controls</h2>
                    <Form.Group widths="equal">
                        <Form.Checkbox
                            label="Switch color"
                            name="isSwitchColor"
                            onChange={this.handleChangeChecked}
                            checked={this.state.isSwitchColor}
                            toggle
                        />
                        <Form.Checkbox
                            label="Switch teams"
                            name="isSwitchTeams"
                            onChange={this.handleChangeChecked}
                            checked={this.state.isSwitchTeams}
                            toggle
                        />
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Button primary onClick={this.handleConfigSubmit}>Save</Form.Button>
                    </Form.Group>
                    <hr/>

                    {/* teams */}
                    <h2>Teams</h2>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column>
                                <h3>Team {this.state.teamLeftName || 'One'}</h3>
                                <Form.Input
                                    label="Name"
                                    name="teamLeftName"
                                    placeholder=""
                                    onChange={this.handleChangeValue}
                                    value={this.state.teamLeftName}
                                />
                                <Form.Input
                                    label="score"
                                    name="teamLeftScore"
                                    placeholder=""
                                    onChange={this.handleChangeValue}
                                    value={this.state.teamLeftScore}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <h3>Team {this.state.teamRightName || 'Two'}</h3>
                                <Form.Input
                                    label="name"
                                    name="teamRightName"
                                    placeholder=""
                                    onChange={this.handleChangeValue}
                                    value={this.state.teamRightName}
                                />
                                <Form.Input
                                    label="score"
                                    name="teamRightScore"
                                    placeholder=""
                                    onChange={this.handleChangeValue}
                                    value={this.state.teamRightScore}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column colapse={2}>
                                <Form.Group inline>
                                    <Form.Button primary onClick={this.handleTeamSubmit}>Save</Form.Button>
                                </Form.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <hr/>

                    {/* Players */}
                    <h2>Players</h2>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column>
                                <h3>{this.state.teamLeftName || 'One'}</h3>
                                <Form.Group inline>
                                    <Form.Input
                                        name="first"
                                        placeholder=""
                                        onChange={this.handleChangeValueSub('left')}
                                        value={this.state.left.first}
                                    />
                                    <Form.Checkbox name={"isFirst"} checked={this.state.left.isFirst} onChange={this.handleChangeCheckedSub(('left'))} toggle fitted />
                                </Form.Group>
                                <Form.Group inline>
                                    <Form.Input
                                        name="second"
                                        placeholder=""
                                        onChange={this.handleChangeValueSub('left')}
                                        value={this.state.left.second}
                                    />
                                    <Form.Checkbox name={"isSecond"} checked={this.state.left.isSecond} onChange={this.handleChangeCheckedSub(('left'))} toggle fitted />
                                </Form.Group>
                                <Form.Group inline>
                                    <Form.Input
                                        name="thrid"
                                        placeholder=""
                                        onChange={this.handleChangeValueSub('left')}
                                        value={this.state.left.thrid}
                                    />
                                    <Form.Checkbox name={"isThrid"} checked={this.state.left.isThrid} onChange={this.handleChangeCheckedSub(('left'))} toggle fitted />
                                </Form.Group>
                            </Grid.Column>
                            <Grid.Column>
                                <h3>{this.state.teamRightName || 'Two'}</h3>
                                <Form.Group inline>
                                    <Form.Input
                                        name="first"
                                        placeholder=""
                                        onChange={this.handleChangeValueSub('right')}
                                        value={this.state.right.first}
                                    />
                                    <Form.Checkbox name={"isFirst"} checked={this.state.right.isFirst} onChange={this.handleChangeCheckedSub(('right'))} toggle fitted />
                                </Form.Group>
                                <Form.Group inline>
                                    <Form.Input
                                        name="second"
                                        placeholder=""
                                        onChange={this.handleChangeValueSub('right')}
                                        value={this.state.right.second}
                                    />
                                    <Form.Checkbox name={"isSecond"} checked={this.state.right.isSecond} onChange={this.handleChangeCheckedSub(('right'))} toggle fitted />
                                </Form.Group>
                                <Form.Group inline>
                                    <Form.Input
                                        name="thrid"
                                        placeholder=""
                                        onChange={this.handleChangeValueSub('right')}
                                        value={this.state.right.thrid}
                                    />
                                    <Form.Checkbox name={"isThrid"} checked={this.state.right.isThrid} onChange={this.handleChangeCheckedSub(('right'))} toggle fitted />
                                </Form.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <hr />

                    {/* Game */}
                    <h2>Game</h2>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Input
                                    label={(this.state.teamLeftName || 'One') + ' score'}
                                    name="leftGameScore"
                                    placeholder=""
                                    onChange={this.handleChangeValue}
                                    value={this.state.leftGameScore}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Input
                                    label={(this.state.teamRightName || 'Two') + ' score'}
                                    name="rightGameScore"
                                    placeholder=""
                                    onChange={this.handleChangeValue}
                                    value={this.state.rightGameScore}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <hr />
                    <Form.Group>
                        <Form.Button color="red" onClick={this.handleGameSubmit}>Save</Form.Button>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default App;
