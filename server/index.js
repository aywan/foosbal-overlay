const WebSocketServer = require('websocket').server;
const http = require('http');
const jsonPatch = require('fast-json-patch');

const defaultState = require('./../default-state');

const index = http.createServer(function(request, response) {});

index.listen(9876, function() { });

let wsServer = new WebSocketServer({
    httpServer: index
});

let clients = [];

let objectStore = {

};

let state = {
    version: 1,
    data: {

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

