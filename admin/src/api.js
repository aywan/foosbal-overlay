// @flow

import {Component} from 'react';

class WsClient {
    connection: WebSocket = null;
    version = 0;
    state = {};

    constructor (page: Component) {
        this.page = page;
    }

    open = () => {
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        this.connection = new WebSocket("ws://localhost:9876");
        this.connection.onmessage = this.onMessage;
    };

    close = () => {
        this.connection.close();
    };

    onMessage = (message) => {
        try {
            let json = JSON.parse(message.data);
            if (this.version < json.version) {
                this.page.updateState(json.data);
            }
            this.version = json.version;
            this.state = json.data;
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data, e);
        }
    };

    sendPatch = (state) => {
        this.version++;

        const data = {
            version: this.version,
            data: state,
        };
        this.state = state;

        this.connection.send(JSON.stringify(data));
    };

    getState() {
        return this.state;
    }
}

export {WsClient};