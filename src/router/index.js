// @flow

import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";

import {AdminPage} from './../pages/admin';

class AppRouter extends Component<> {

    render () {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={AdminPage}/>
                </div>
            </BrowserRouter>
        );
    }
}

export {AppRouter};