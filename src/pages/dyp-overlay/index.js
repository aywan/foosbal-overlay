// @flow

import React, { Component } from 'react';
import './App.css';

import logoIcon from '../../img/logo.svg';
import leftPlayerDoubleIcon from '../../img/player-left-double.svg';
import leftPlayerSingleIcon from '../../img/player-left-single.svg';
import rightPlayerDoubleIcon from '../../img/player-right-dobule.svg';
import rightPlayerSingleIcon from '../../img/player-right-single.svg';

import {WsClient, GetWsClient} from "../../services/api";
import type {StateType, TeamType} from "../../types";

import {TOURNAMENT} from '../../enums/channels';

const defState = {
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

const createPlayers = (p: TeamType) => {
  let team = [];
  if (p.isFirst) {
    team.push(p.first);
  }
  if (p.isSecond) {
    team.push(p.second);
  }
  if (p.isThrid) {
    team.push(p.thrid);
  }
  return team;
};

class TournamentOverlay extends Component<{}, StateType> {

  client: WsClient;
  state: StateType = defState;

  constructor () {
    super();
    this.client = GetWsClient();
    this.client.registerComponent(this.updateState, TOURNAMENT)
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

  render() {

    const leftPlayers = createPlayers(this.state.isSwitchTeams ? this.state.right : this.state.left);
    const rightPlayers = createPlayers(this.state.isSwitchTeams ? this.state.left : this.state.right);

    let leftIcon = leftPlayers.length > 1 ? leftPlayerDoubleIcon : leftPlayerSingleIcon;
    let rightIcon = rightPlayers.length > 1 ? rightPlayerDoubleIcon: rightPlayerSingleIcon;

    return (
      <div className="App">
        <div className="teams">
          <div className="team team_one">{this.state.isSwitchTeams ? this.state.teamRightName : this.state.teamLeftName}</div>
          <div className="team-score team-score__one">{this.state.isSwitchTeams ? this.state.teamRightScore : this.state.teamLeftScore}</div>
          <div className="logo"><img src={logoIcon} alt={"logo"}/></div>
          <div className="team-score team-score__two">{this.state.isSwitchTeams ? this.state.teamLeftScore : this.state.teamRightScore}</div>
          <div className="team team_two">{this.state.isSwitchTeams ? this.state.teamLeftName : this.state.teamRightName}</div>
        </div>
        <div className="players">
          <div className={"player " + (this.state.isSwitchColor ? "player_blue" : "player_red") + " player_one"}>
            <div className="player__icon"><img src={leftIcon} alt={"left player"}/></div>
            <div className="player__name">{leftPlayers.join(', ')}</div>
            <div className="player__score">{this.state.isSwitchTeams ? this.state.rightGameScore : this.state.leftGameScore}</div>
          </div>
          <div className={"player "  + (this.state.isSwitchColor ? "player_red" : "player_blue") + " player_two"}>
            <div className="player__icon"><img src={rightIcon} alt={"right player"}/></div>
            <div className="player__name">{rightPlayers.join(', ')}</div>
            <div className="player__score">{this.state.isSwitchTeams ? this.state.leftGameScore : this.state.rightGameScore}</div>
          </div>
        </div>
      </div>
    );
  }
}

export {TournamentOverlay};
