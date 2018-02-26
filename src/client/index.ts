import { Effect, EffectEnum } from './effects';
import { WebSocketMessage } from './web-socket-message';
import * as http from 'http';

var canvas: HTMLCanvasElement;
var canvasContext: CanvasRenderingContext2D;
var input: HTMLInputElement;
var inputHistory: HTMLUListElement;
var footer: HTMLDivElement;
var effectsQueue: Effect[][] = [];
var socket: WebSocket;
var maxFps = 60;
var currentFps = 0;
var currentFrameRate = 0;
var frameCount = 0;
var lastFrameTime = 0;
var lastFrameCount = 0;
var startTime = 0;
var lastMouseX = 0;
var lastMouseY = 0;

function start()
{
    // set body values
    document.body.style.backgroundColor = "#000000";
    document.body.style.cursor = "crosshair";
    document.body.style.font = "13px Helvetica, Arial";

    // create canvas
    canvas = document.createElement("canvas");
    canvasContext = canvas.getContext("2d");
    canvas.innerHTML = "Your browser does not support the canvas element.";
    canvas.style.border = "0";
    //canvas.style.border = "2px solid #c3c3c3";  // sand: #fff2c4, forest: #206020
    canvas.style.backgroundColor = "black";  // sand: #fff2c4, forest: #206020
    canvas.onmousemove = mouseMove;

    // create CLI
    // at the very least I need an input field and a command history
    // also need Enter toggle for command input vs free text
    // ctrl + Back deletes all text, ctrl + x/c/v cuts, copies, and pastes text
    let form = document.createElement("form");
    form.action = "command";
    form.style.background = "#000";
    form.style.padding = "3px";
    form.style.position = "fixed";
    form.style.bottom = "0";
    form.style.width = "100%";

    let div = document.createElement("div");

    let prompt = document.createElement("span");
    prompt.innerText = "> "
    prompt.style.fontFamily = "courier";
    prompt.style.backgroundColor = "#000";
    prompt.style.color = "#00ff00";
    prompt.style.width = "1%";
    prompt.style.whiteSpace = "nowrap";

    input = document.createElement("input");
    input.autocomplete = "off";
    input.style.width = "90%";
    input.style.fontFamily = "courier";
    input.style.backgroundColor = "#000";
    input.style.color = "#00ff00";
    input.style.position = "relative";
    input.style.border = "0px";
    input.style.borderWidth = "0";
    input.style.outline = "none";
    input.style.cursor = "crosshair";

    inputHistory = document.createElement("ul");
    inputHistory.style.listStyleType = "none";
    inputHistory.style.margin = "0";
    inputHistory.style.padding = "0";

    form.appendChild(div);
    div.appendChild(prompt);
    div.appendChild(input);

    input.focus();
    resize();

    // create HUD
    // display actual frame rate vs. max frame rate
    // display frame count
    footer = document.createElement("div");
    footer.style.color = "#00aa00";
    footer.style.background = "#000";
    footer.style.fontSize = "8px"
    footer.style.padding = "2px";
    footer.style.width = "5%";
    footer.style.position = "fixed";
    footer.style.bottom = "0";
    footer.style.right = "0";
    footer.style.textAlign = "right";
    footer.style.whiteSpace = "nowrap";
    footer.innerText = "test footer";

    // create mini-map
    // refresh rate for mini-map will be independently controlled

    // fade some text in
    let titleText = document.createElement("label");
    titleText.innerText = "nebulous / actual"
    titleText.style.fontSize = "48pt";
    titleText.style.color = "#00ff00";
    titleText.style.position = "absolute";
    titleText.style.top = "150px"; // center this vertically
    titleText.style.left = "150px"; // center this horizontally
    effectsQueue.push([new Effect(titleText, EffectEnum.fadeIn, 180), new Effect(titleText, EffectEnum.fadeOut, 180)]);

    document.body.appendChild(titleText);
    document.body.appendChild(canvas);
    document.body.appendChild(inputHistory);
    document.body.appendChild(form);
    document.body.appendChild(footer);

    // scroll some init text when page loads


    // handle form submissions:
    form.onsubmit = function sendForm(event)
    {
        socket.send(JSON.stringify(new WebSocketMessage("command", input.value)));
        input.value = '';
        return false; // Prevent page from submitting.
    }

    // Create WebSocket connection.
    socket = new WebSocket('ws://localhost:3001');

    // Connection opened
    socket.addEventListener('open', function (event)
    {
        socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function (event)
    {
        console.log('Message from server ', event.data);
    });

    socket.addEventListener('close', function (event)
    {
        console.log('close');
        socket.close();
    });
    runLoop();

}

function runLoop()
{
    // do shit

    // check draw queue (shapes, lines, glyphs, etc.)

    // update HUD
    // set refresh rate for HUD -- doesn't need to be every frame
    let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
    if (startTime === 0)
    {
        startTime = timeStampInMs;
    }
    if (0 === frameCount % 30)
    {
        currentFps = Math.floor(1000 * (frameCount - lastFrameCount) / (timeStampInMs - lastFrameTime));
    }
    //footer.innerText = `${frameCount} ${Math.floor(timeStampInMs - startTime)} ${fps}/${maxFps}`;
    footer.innerText = `${lastMouseX} ${lastMouseY} ${currentFps}/${maxFps}`;
    lastFrameTime = timeStampInMs;
    lastFrameCount = frameCount;

    // check effects queue
    let newQueue: Effect[][] = [];
    effectsQueue.forEach(effectChain =>
    {
        let effect = effectChain.shift();
        if (effect.advance())
        {
            effectChain.unshift(effect);
        }
        if (0 < effectChain.length)
        {
            newQueue.push(effectChain);
        }
    });
    effectsQueue = newQueue;
    setTimeout(runLoop, 1000 / maxFps);
    input.focus();
    frameCount++;
}

function resize()
{
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 25;
}

function contextMenu()
{
    // draw my own context menu!
    return false;
}

function mouseMove(mouseEvent: MouseEvent)
{
    lastMouseX = mouseEvent.x;
    lastMouseY = mouseEvent.y;
    //socket.send(JSON.stringify(new WebSocketMessage("mouseMove", `${lastMouseX},${lastMouseY}`)));
}

// Do it.
window.onresize = resize;
window.oncontextmenu = contextMenu;
start();