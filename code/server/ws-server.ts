import { WebSocketMessage } from './web-socket-message';
import * as util from "util";
import * as ws from "ws";

export class WsServer
{
    webSocketServer: ws.Server;

    constructor(port: number)
    {
        this.webSocketServer = new ws.Server({ port: port }, );

        this.webSocketServer.on('connection', (webSocket) =>
        {
            console.log('websocket connection established');
            webSocket.on('message', (messageString) =>
            {
                let message: WebSocketMessage = JSON.parse(messageString.toString());
                console.log(`received: ${message.message}`);
                webSocket.send(`WebSocket connected on port ${port}`);
                for (let currSocket in this.webSocketServer.clients)
                {

                }
            });
            webSocket.on('close', function closeHandler()
            {
                console.log('websocket connection closed');
            });
            webSocket.on('error', (error) =>
            {
                console.log(`websocket error: ${util.inspect(error)}`);
            });

            webSocket.send(`WebSocket connected on port ${port}`);
        });
    }
}