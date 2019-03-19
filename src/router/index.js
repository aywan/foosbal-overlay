// @flow

import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";

import {AdminPage} from './../pages/admin';
import {PlayersPage} from "../pages/players";

class AppRouter extends Component<> {

    render () {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={AdminPage}/>
                    <Route path="/players" exact component={PlayersPage}/>
                </div>
            </BrowserRouter>
        );
    }
}

export {AppRouter};
