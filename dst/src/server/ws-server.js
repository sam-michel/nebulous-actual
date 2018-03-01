"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const ws = require("ws");
class WsServer {
    constructor(port) {
        this.webSocketServer = new ws.Server({ port: port });
        this.webSocketServer.on('connection', (webSocket) => {
            console.log('websocket connection established');
            webSocket.on('message', (message) => {
                console.log(`received: ${message}`);
            });
            webSocket.on('close', function closeHandler() {
                console.log('websocket connection closed');
            });
            webSocket.on('error', (error) => {
                console.log(`websocket error: ${util.inspect(error)}`);
            });
            webSocket.send(`WebSocket connected on port ${port}`);
        });
    }
}
exports.WsServer = WsServer;
//# sourceMappingURL=ws-server.js.map