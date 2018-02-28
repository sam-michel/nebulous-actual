/* Entry point for nodejs server.
 * Build with tsc --watch
 *
 */
const http = require('http');
const fs = require('fs');
const url = require('url');
var util = require('util');
const ws = require('ws');
const hostname = 'localhost';
const httpPort = 3000;
const wsPort = 3001;
const server = http.createServer((req, res) => {
    req.setEncoding('utf8');
    req.on('data', function (data) {
        console.log(data);
    });
    let response = "";
    let reqPath = url.parse(req.url).pathname;
    console.log(reqPath);
    if (reqPath === '/command') {
        //response = "Command received, thanks!";
        response = util.inspect(req);
        // now do something with the command...
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(response);
    }
    else {
        let fileName;
        if (reqPath === "/") {
            fileName = "dst/index.html";
        }
        else {
            fileName = `dst/${reqPath.slice(1)}`;
        }
        console.log(fileName);
        fs.readFile(fileName, 'utf8', (err, contents) => {
            if (err) {
                console.log(`error: ${err}`);
                response = "no such file :(";
                res.statusCode = 404;
            }
            else {
                response = contents;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(response);
        });
    }
});
server.listen(httpPort, hostname, () => {
    console.log(`Server running at http://${hostname}:${httpPort}/`);
});
const wsServer = new ws.Server({ port: wsPort });
wsServer.on('connection', function connection(webSocket) {
    console.log('websocket connection established');
    webSocket.on('message', function messageHandler(message) {
        console.log(`received: ${message}`);
    });
    webSocket.on('close', function closeHandler() {
        console.log('websocket connection closed');
    });
    webSocket.on('error', function errorHandler(event) {
        console.log(`websocket error: ${util.inspect(event)}`);
        //webSocket.close();
    });
    webSocket.send('something');
});
//# sourceMappingURL=main.js.map