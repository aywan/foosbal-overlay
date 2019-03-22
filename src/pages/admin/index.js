// @flow

import React, {Component} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import {Form, Grid} from "semantic-ui-react";
import {GetWsClient, WsClient} from "./../../services/api";

import type {StateType} from "../../types";

import {defaultState} from '../../helpers/default-state';
import {TOURNAMENT} from '../../enums/channels';

class AdminPage extends Component<{}, StateType> {
    isMount: boolean = false;
    client: WsClient;

    state: StateType = defaultState;

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

    handleGameSubmit = () => {
        this.client.sendPatch(this.state, TOURNAMENT);
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
                                    type={"number"}
                                    min={0}
                                    max={4}
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
                                    type={"number"}
                                    min={0}
                                    max={4}
                                />
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
                                    type={"number"}
                                    min={0}
                                    max={5}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Input
                                    label={(this.state.teamRightName || 'Two') + ' score'}
                                    name="rightGameScore"
                                    placeholder=""
                                    onChange={this.handleChangeValue}
                                    value={this.state.rightGameScore}
                                    type={"number"}
                                    min={0}
                                    max={5}
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

export {AdminPage};
