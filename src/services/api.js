// @flow

class WsClient {
    connection: WebSocket = null;
    objectStore = {};
    handlers = {};

    registerComponent (callback: Function, name: string) {
        let handlers = this.handlers[name] || [];
        handlers.push(callback);
        this.handlers[name] = handlers;
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
        let json = JSON.parse(message.data);

        switch (json.command) {
            case "store":
                this.updateStore(json);
                break;

            case "object":
                this.updateObject(json);
                break;

            default:
                return;
        }
    };

    sendPatch = (data, name: string) => {
        let object = this.objectStore[name] || {version: 0};
        object.version++;
        object.data = data;

        this.objectStore[name] = object;

        this.connection.send(JSON.stringify({
            ...object,
            name: name,
        }));
    };

    updateStore (json) {
        this.objectStore = json.data;

        Object.keys(this.objectStore).forEach((key) => {
            this.runHandlers(key);
        })
    }

    updateObject (json) {
        const name = json.name;
        let object = this.objectStore[name];
        if (object.version >= json.version) {
            return;
        }
        object.version = json.version;
        object.data = json.data;
        this.objectStore[name] = object;
    }

    runHandlers (key: string) {
        const list = this.handlers[key] || [];
        const obj = this.objectStore[key] || {};

        list.forEach((c) => c(obj.data || {}));
    }
}

export {WsClient};

let wsInstance = null;

export function GetWsClient (): WsClient {
    if (wsInstance === null) {
        wsInstance = new WsClient();
    }
    return wsInstance
}