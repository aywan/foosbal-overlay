// @flow

import React, {Component} from "react";
import 'semantic-ui-css/semantic.min.css';
import {Form, Button} from "semantic-ui-react";
import './index.css';

type PlayersPageState = {
    list: Array<string>
}

class PlayersPage extends Component<{}, list> {

    state = {
        list: ["F", "B"]
    };

    deletePlayer = (idx:number) => {
        return () => {
            console.log(idx);
            const newList = this.state.list.splice(idx, 1);
            this.setState({list:newList})
        }
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
                                        <Form.Input value={p}/>
                                        <Button icon={"trash"} click={this.deletePlayer(idx)}/>
                                    </Form.Group>
                                </Form>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}

export {PlayersPage};
