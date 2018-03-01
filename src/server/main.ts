// Entry point for nodejs server.
// Build with: tsc --watch
// Run with: node src/main.js

import * as http from "http";
import * as fs from "fs";
import * as url from "url";
import * as util from "util";
import * as ws from "ws";

const hostname = 'localhost';
const httpPort = 3000;
const wsPort = 3001;

const server = http.createServer((req, res) =>
{
    //req.setEncoding('utf8');
    //req.on('data', function (data: any) // get request body
    //{
    //    console.log(data);
    //});
    let response = "";
    let reqPath = url.parse(req.url).pathname;
    console.log(reqPath);
    //console.log(util.inspect(req));

    let fileName = reqPath === "/" ? "dst/index.html" : `dst/${reqPath.slice(1)}`;

    fs.readFile(fileName, 'utf8', (err: any, contents: any) =>
    {
        if (err)
        {
            console.log(`error: ${err}`);
            response = "no such file :("
            res.statusCode = 404;
        } else
        {
            response = contents;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(response);
    });
});

server.listen(httpPort, hostname, () =>
{
    console.log(`Server running at http://${hostname}:${httpPort}/`);
});

const wsServer = new ws.Server({ port: wsPort }, );

wsServer.on('connection', (webSocket) =>
{
    console.log('websocket connection established');
    webSocket.on('message', (message) =>
    {
        console.log(`received: ${message}`);
    });
    webSocket.on('close', function closeHandler()
    {
        console.log('websocket connection closed');
    });
    webSocket.on('error', (event) =>
    {
        console.log(`websocket error: ${util.inspect(event)}`);
        //webSocket.close();
    });

    webSocket.send('something');
});