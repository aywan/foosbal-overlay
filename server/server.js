const WebSocketServer = require('websocket').server;
const http = require('http');
const jsonPatch = require('fast-json-patch');

const defaultState = require('./../default-state');

const server = http.createServer(function(request, response) {});

server.listen(9876, function() { });

let wsServer = new WebSocketServer({
    httpServer: server
});

let clients = [];

let state = {
    version: 1,
    data: {
        isSwitchColor: false,
        isSwitchTeams: false,
        teamLeftName: '',
        teamRightName: '',
        teamLeftScore: 0,
        teamRightScore: 0,
        left: {
            first: '',
            isFirst: false,
            second: '',
            isSecond: false,
            thrid: '',
            isThrid: false,
        },
        right: {
            first: '',
            isFirst: false,
            second: '',
            isSecond: false,
            thrid: '',
            isThrid: false,
        },
        leftGameScore: 0,
        rightGameScore: 0,
    },
};

const broadcast = (msg) => {
    let json = JSON.stringify(msg);
    clients.forEach((c, idx) => {
        c.sendUTF(json);
    });
};


wsServer.on('request', (request) => {

    let connection = request.accept(null, request.origin);
    let idx = clients.push(connection) - 1;

    console.log('New client');

    connection.sendUTF(JSON.stringify(state));

    connection.on('close', (connection) => {
        clients.splice(idx, 1);
    });

    connection.on('message', (message) => {
        if (message.type !== 'utf8') {
            console.log('Bad message type');
        }
        let json = JSON.parse(message.utf8Data);
        if (json.version <= state.version) {
            return;
        }

        state.version = json.version;
        state.data = json.data;

        console.log(state);

        broadcast(state);
    });
});

