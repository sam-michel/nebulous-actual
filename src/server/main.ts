// Entry point for nodejs server.
// Build with: tsc --watch
// Run with: node dst/src/server/main.js

import { HttpServer } from "./http-server";
import { WsServer } from "./ws-server";

const httpServer = new HttpServer(3000, "localhost");
const wsServer = new WsServer(3001);