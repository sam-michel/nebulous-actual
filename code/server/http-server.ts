import * as http from "http";
import * as url from "url";
import * as fs from "fs";

export class HttpServer
{
    port: number;
    host: string;
    server: http.Server;

    constructor(port: number, host: string)
    {
        this.port = port;
        this.host = host;
        this.server = http.createServer((req, res) =>
        {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            let reqPath = url.parse(req.url).pathname;
            let fileName = undefined;
            let response = "";
            console.log(reqPath);
            switch (reqPath)
            {
                case "/":
                    fileName = "resource/index.html";
                    break;
                case "/favicon.ico":
                    fileName = `resource${reqPath}`;
                    break;
                case "/nebulous-actual.js":
                    fileName = `build${reqPath}`;
                    break;
                default:
                    response = "Gone coding."
                    res.statusCode = 410;
                    res.end(response);
                    break;
            }

            if (fileName)
            {
                console.log(`reading file: ${fileName}`);
                fs.readFile(fileName, 'utf8', (err: any, contents: any) =>
                {
                    if (err)
                    {
                        response = "Failed to read requested file."
                        res.statusCode = 404;
                    }
                    else
                    {
                        response = contents;
                        res.statusCode = 200;
                    }
                    res.end(response);
                });
            }

        });

        this.start();
    }

    start()
    {
        this.server.listen(this.port, this.host, () =>
        {
            console.log(`Server running at http://${this.host}:${this.port}/`);
        });
    }
}