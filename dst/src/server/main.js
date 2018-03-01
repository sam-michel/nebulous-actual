"use strict";
// Entry point for nodejs server.
// Build with: tsc --watch
// Run with: node dst/src/server/main.js
Object.defineProperty(exports, "__esModule", { value: true });
const http_server_1 = require("./http-server");
const ws_server_1 = require("./ws-server");
const httpServer = new http_server_1.HttpServer(3000, "localhost");
const wsServer = new ws_server_1.WsServer(3001);
//# sourceMappingURL=main.js.map