/*************************************************************************************************\
 * Whatever I would write in here should just as well go in the readme.md
\*************************************************************************************************/

import { Effect, EffectEnum } from './effects';
import { Horizon } from './horizon/horizon';
import { Terminal } from './terminal';
import { WebSocketMessage } from '../server/web-socket-message';

/*************************************************************************************************\
 * Application serves as the entry point for the client. It is primarily responsible for composing
 * the necessary elements and routing user input.
\*************************************************************************************************/
export class Application
{
    effectsQueue: Effect[][] = [];
    focusTarget: HTMLElement;
    footer: HTMLDivElement;
    terminal: Terminal;
    maxFps: number = 60;
    currentFps: number = 0;
    frameCount: number = 0;
    lastFrameTime: number = 0;
    lastFrameCount: number = 0;
    startTime: number = 0;
    horizon: Horizon;

    constructor()
    {
        // set body values
        document.body.style.backgroundColor = "#000000";
        document.body.style.cursor = "crosshair";
        document.body.style.font = "13px Helvetica, Arial";

        // draw horizon
        this.horizon = new Horizon();
        this.horizon.draw();

        // display title
        let titleText = document.createElement("label");
        titleText.innerText = "nebulous / actual"
        titleText.style.fontSize = "48pt";
        titleText.style.color = "#009900";
        titleText.style.position = "absolute";
        titleText.style.top = "100px"; // center this vertically
        titleText.style.left = "100px"; // center this horizontally
        titleText.style.display = "none";
        let fadeDuration = 150;
        this.effectsQueue.push([
            new Effect(titleText, EffectEnum.fadeIn, fadeDuration),
            new Effect(titleText, EffectEnum.fadeOut, fadeDuration),
            new Effect(titleText, EffectEnum.makeInvisible)
        ]);
        this.effectsQueue.push([
            new Effect(titleText, EffectEnum.makeVisible),
            new Effect(titleText, EffectEnum.moveTo, 2 * fadeDuration, 0, { x: window.innerWidth / 2, y: window.innerHeight / 2 })
        ]);
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
        window.addEventListener('keydown', this.terminal.onKeyboardEvent);
        window.addEventListener('keypress', this.terminal.onKeyboardEvent);
        window.oncontextmenu = this.contextMenu;
    }

    runLoop()
    {
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
        app.footer.innerText = `${app.currentFps}/${app.maxFps}`;
        app.lastFrameTime = timeStampInMs;
        app.lastFrameCount = app.frameCount;

        app.doEffects();
        app.horizon.update();
        requestAnimationFrame(app.runLoop);  //setTimeout(app.runLoop, 1000 / 60)
        app.focusTarget.focus();
        app.frameCount++;
    }

    doEffects()
    {
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
}

var app = new Application();
app.runLoop();