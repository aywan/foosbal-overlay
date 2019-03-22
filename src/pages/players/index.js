// @flow

import React, {Component} from "react";
import 'semantic-ui-css/semantic.min.css';
import {Form, Button} from "semantic-ui-react";
import './index.css';

type PlayersPageState = {
    newPlayer: string,
    list: Array<string>
}

class PlayersPage extends Component<{}, PlayersPageState> {

    state = {
        newPlayer: "",
        list: ["F", "B", "X"]
    };

    deletePlayerHandler (e: SyntheticInputEvent<Button>, idx: number) {
        const oldList = this.state.list;
        oldList.splice(idx, 1);
        this.setState({list:oldList})
    };

    changeNewPlayer = (e: SyntheticInputEvent<Button>, form) => {
        this.setState({newPlayer: form.value});
    };

    addPlayer = (e: SyntheticInputEvent) => {
        const list = this.state.list;
        list.push(this.state.newPlayer);
        this.setState({
            newPlayer: "",
            list: list,
        });
    };


    render () {
        return (
            <div className={"App"}>
                <h1>Players</h1>
                <ul>
                    {this.state.list.map((p, idx) => {
                        return (
                            <li key={idx}>
                                <Form>
                                    <Form.Group>
                                        {idx}
                                        <Form.Input value={p}/>
                                        <Button icon={"trash"} onClick={(e) => this.deletePlayerHandler(e, idx)}/>
                                    </Form.Group>
                                </Form>
                            </li>
                        )
                    })}
                </ul>
                <Form onSubmit={(e) => this.addPlayer(e)}>
                    <Form.Group onSubmit={this.addPlayer}>
                        <Form.Input name={"player"} onChange={this.changeNewPlayer}/>
                        <Button type={"submit"} icon={"sign-in"} value={this.state.newPlayer} />
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export {PlayersPage};
