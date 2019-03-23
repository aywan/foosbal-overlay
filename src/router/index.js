// @flow

import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";

import {AdminPage} from './../pages/admin-dyp';
import {PlayersPage} from "../pages/players";
import {TournamentOverlay} from "../pages/t-overlay";

class AppRouter extends Component<> {

    render () {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={AdminPage}/>
                    <Route path="/players" exact component={PlayersPage}/>
                    <Route path="/t-overlay" exact component={TournamentOverlay}/>
                </div>
            </BrowserRouter>
        );
    }
}

export {AppRouter};
