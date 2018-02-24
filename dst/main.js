const http = require('http');
const fs = require('fs');
const url = require('url');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
    // check for file name
    let response = "";
    let fileName = url.parse(req.url).pathname; //.slice(1);
    if (fileName === "/") {
        fileName = "index.html";
    }
    else {
        fileName = fileName.slice(1);
    }
    console.log(fileName);
    fs.readFile(fileName, 'utf8', (err, contents) => {
        if (err) {
            console.log(`error: ${err}`);
            throw err;
        }
        else {
            response = contents;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(response);
        }
    });
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
//# sourceMappingURL=main.js.map