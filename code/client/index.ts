// Entry point for client
// pack with: webpack --watch

import { Effect, EffectEnum } from './effects';
import { Horizon } from './horizon';
import { Terminal } from './terminal';
import { WebSocketMessage } from '../server/web-socket-message';

export class Application
{
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    effectsQueue: Effect[][] = [];
    focusTarget: HTMLElement;
    footer: HTMLDivElement;
    terminal: Terminal;
    maxFps: number = 60;
    currentFps: number = 0;
    currentFrameRate: number = 0;
    frameCount: number = 0;
    lastFrameTime: number = 0;
    lastFrameCount: number = 0;
    startTime: number = 0;
    lastMouseX: number = 0;
    lastMouseY: number = 0;

    constructor()
    {
        // set body values
        document.body.style.backgroundColor = "#000000";
        document.body.style.cursor = "crosshair";
        document.body.style.font = "13px Helvetica, Arial";

        // create canvas
        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.canvas.innerHTML = "Your browser does not support the canvas element.";
        this.canvas.style.border = "0";
        this.canvas.style.padding = "0";
        this.canvas.style.backgroundColor = "black";  // sand: #fff2c4, forest: #206020
        this.canvas.style.position = "absolute";
        this.canvas.style.bottom = "0px";
        this.canvas.style.left = "0px"
        this.canvas.width = 2000; // was window.innerWidth
        this.canvas.height = 2000; // was window.innerHeight
        this.canvas.onmousemove = this.mouseMove;
        this.canvas.onkeypress = this.keyPress;
        document.body.appendChild(this.canvas);

        // draw horizon
        let horizon = new Horizon(this.canvas);
        horizon.draw();

        // display title
        let titleText = document.createElement("label");
        titleText.innerText = "nebulous / actual"
        titleText.style.fontSize = "48pt";
        titleText.style.color = "#00ff00";
        titleText.style.position = "absolute";
        titleText.style.top = "150px"; // center this vertically
        titleText.style.left = "150px"; // center this horizontally
        //titleText.style.display = "none";
        this.effectsQueue.push([
            new Effect(titleText, EffectEnum.makeVisible),
            new Effect(titleText, EffectEnum.fadeIn, 100),
            new Effect(titleText, EffectEnum.fadeOut, 100),
            new Effect(titleText, EffectEnum.makeInvisible)
        ]);
        this.effectsQueue.push([new Effect(titleText, EffectEnum.moveTo, 200, 0, { x: 300, y: 300 })]);
        document.body.appendChild(titleText);

        this.terminal = new Terminal(this);
        this.focusTarget = this.terminal.input;

        // create HUD
        // display actual frame rate vs. max frame rate
        // display frame count
        this.footer = document.createElement("div");
        this.footer.style.color = "#00aa00";
        this.footer.style.background = "#000";
        this.footer.style.fontSize = "8px"
        this.footer.style.padding = "2px";
        this.footer.style.width = "5%";
        this.footer.style.position = "fixed";
        this.footer.style.bottom = "0";
        this.footer.style.right = "0";
        this.footer.style.textAlign = "right";
        this.footer.style.whiteSpace = "nowrap";
        this.footer.innerText = "test footer";
        document.body.appendChild(this.footer);

        // scroll some init text when page loads...

        window.onresize = this.resize;
        window.oncontextmenu = this.contextMenu;
    }

    start()
    {
        //this.resize(); // this does the initial paint of the horizon...
        setTimeout(this.runLoop, 1000 / this.maxFps);
    }

    runLoop()
    {
        // do shit
        //resize();

        // check draw queue (shapes, lines, glyphs, etc.)
        //let horizon = new Horizon(canvas);
        //horizon.draw();
        //horizon.drawStars(canvas);

        // update HUD
        // set refresh rate for HUD -- doesn't need to be every frame
        let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
        if (app.startTime === 0)
        {
            app.startTime = timeStampInMs;
        }
        if (0 === app.frameCount % 30)
        {
            app.currentFps = Math.floor(1000 * (app.frameCount - app.lastFrameCount) / (timeStampInMs - app.lastFrameTime));
        }
        //footer.innerText = `${frameCount} ${Math.floor(timeStampInMs - startTime)} ${fps}/${maxFps}`;
        app.footer.innerText = `${app.lastMouseX} ${app.lastMouseY} ${app.currentFps}/${app.maxFps}`;
        app.lastFrameTime = timeStampInMs;
        app.lastFrameCount = app.frameCount;

        // check effects queue
        let newQueue: Effect[][] = [];
        app.effectsQueue.forEach(effectChain =>
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
        app.effectsQueue = newQueue;
        setTimeout(app.runLoop, 1000 / app.maxFps);
        app.focusTarget.focus();
        app.frameCount++;
    }

    resize()
    {
        //app.canvas.width = window.innerWidth;
        //app.canvas.height = window.innerHeight;
        //let horizon = new Horizon(app.canvas);
        //horizon.draw();
    }

    contextMenu()
    {
        // draw my own context menu!
        return false;
    }

    keyPress(k: KeyboardEvent)
    {
        console.log(`{key pressed on canvas: ${k.key}}`)
        if (k.key === "Enter")
        {
            //app.focusTarget = app.terminal.input;
            //app.effectsQueue.push([new Effect(app.terminal.form, EffectEnum.moveTo, 20, { x: 0, y: 0 })]);

        }
    }

    mouseMove(mouseEvent: MouseEvent)
    {
        app.lastMouseX = mouseEvent.x;
        app.lastMouseY = mouseEvent.y;
        //socket.send(JSON.stringify(new WebSocketMessage("mouseMove", `${lastMouseX},${lastMouseY}`)));
    }
}

var app = new Application();
app.start();