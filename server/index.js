const WebSocketServer = require('websocket').server;
const http = require('http');
const jsonPatch = require('fast-json-patch');

const index = http.createServer(function(request, response) {});

index.listen(9876, function() { });

let wsServer = new WebSocketServer({
    httpServer: index
});

let clients = [];

let objectStore = {};

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

    connection.sendUTF(JSON.stringify({
        command: "store",
        data: objectStore,
    }));

    connection.on('close', (connection) => {
        clients.splice(idx, 1);
    });

    connection.on('message', (message) => {
        if (message.type !== 'utf8') {
            console.log('Bad message type');
        }
        let json = JSON.parse(message.utf8Data);

        const objectName = json.name;
        let object = objectStore[objectName] || {version:0};

        if (json.version > object.version) {
            object.version = json.version;
            object.data = json.data;
            objectStore[objectName] = object;
            console.log(objectName, object);
        }

        broadcast({
            ...object,
            command: "object",
            name: objectName
        });
    });
});

