import { Application } from './index'
import { Effect, EffectEnum } from './effects';
import { WebSocketMessage } from '../server/web-socket-message';

/**
 * The main terminal interface for capturing user text input.
 * Toggle between chat and command mode
 */
export class Terminal
{
    app: Application;
    showTerminal: boolean;
    form: HTMLFormElement;
    input: HTMLInputElement;
    inputHidden: HTMLInputElement;
    inputMode: InputMode;
    prePrompt: HTMLSpanElement;
    postPrompt: HTMLSpanElement;
    socket: WebSocket;

    constructor(app: Application)
    {
        this.app = app;
        this.inputMode = InputMode.command;
        this.showTerminal = true;

        // create CLI
        // at the very least I need an input field and a command history
        // also need Enter toggle for command input vs free text
        // ctrl + Back deletes all text, ctrl + x/c/v cuts, copies, and pastes text
        this.form = document.createElement("form");
        this.form.action = "command";
        this.form.style.background = "#000";
        this.form.style.padding = "3px";
        this.form.style.position = "fixed";
        this.form.style.bottom = "0px";
        this.form.style.left = "0px";
        this.form.style.width = "90%";
        this.form.onsubmit = (event) => { return this.onSubmit(event) };

        let div = document.createElement("div");

        this.prePrompt = document.createElement("span");
        this.prePrompt.innerText = "> "
        this.prePrompt.style.fontFamily = "courier";
        this.prePrompt.style.backgroundColor = "#000";
        this.prePrompt.style.color = "#00ff00";
        this.prePrompt.style.width = "1%";
        this.prePrompt.style.whiteSpace = "nowrap";

        this.postPrompt = document.createElement("span");
        this.postPrompt.innerText = ")))"
        this.postPrompt.style.fontFamily = "courier";
        this.postPrompt.style.backgroundColor = "#000";
        this.postPrompt.style.color = "#00ff00";
        this.postPrompt.style.width = "1%";
        this.postPrompt.style.whiteSpace = "nowrap";
        app.effectsQueue.push([
            new Effect(this.postPrompt, EffectEnum.fadeOut, 10),
            new Effect(this.postPrompt, EffectEnum.makeInvisible)])

        this.input = document.createElement("input");
        this.input.autocomplete = "off";
        this.input.style.width = "90%";
        this.input.style.fontFamily = "courier";
        this.input.style.backgroundColor = "#000";
        this.input.style.color = "#00ff00";
        this.input.style.position = "relative";
        this.input.style.border = "0px";
        this.input.style.borderWidth = "0";
        this.input.style.outline = "none";
        this.input.style.cursor = "crosshair";
        //this.input.onkeydown = (event) => { return this.onKeyboardEvent(event) };
        //this.input.onkeypress = (event) => { return this.onKeyboardEvent(event) };

        this.inputHidden = document.createElement("input");

        let inputHistory = document.createElement("ul");
        inputHistory.style.listStyleType = "none";
        inputHistory.style.margin = "0";
        inputHistory.style.padding = "0";

        this.form.appendChild(div);
        div.appendChild(this.prePrompt);
        div.appendChild(this.input);
        div.appendChild(this.postPrompt);
        document.body.appendChild(this.form);

        this.webSocketConnect('ws://localhost:3001');
    }

    onKeyboardEvent = (event: KeyboardEvent): boolean =>
    {
        //console.log(event.key);
        console.log(`keyboard event: ${event.key}`)
        if (event.key === "Tab")
        {
            event.preventDefault();
            //let lastInputMode = this.toggleInputMode();
            // switch focus mode / hide terminal
            if (this.showTerminal === true)
            {
                this.showTerminal = false;
                this.app.effectsQueue.push([
                    new Effect(this.form, EffectEnum.moveTo, 20, 0, { x: 0, y: -20 }),
                    //new Effect(this.form, EffectEnum.makeInvisible)
                ]); // hide
                this.app.focusTarget = document.body;
                this.input.blur();
            }
            else
            {
                this.showTerminal = true;
                this.app.effectsQueue.push([
                    //new Effect(this.form, EffectEnum.makeVisible),
                    new Effect(this.form, EffectEnum.moveTo, 20, 0, { x: 0, y: 0 })
                ]); // un-hide
                this.app.focusTarget = this.input;
            }
            this.app.focusTarget.focus();
            return false;
        }
        else
        {
            switch (this.inputMode)
            {
                case InputMode.command:
                    break;
                case InputMode.chat:
                    break;
            }
            return true;
        }
    }

    onSubmit(event: Event): boolean
    {
        if (this.input.value === "")
        {
            // Do I want to use this to toggle command mode vs. chat mode OR terminal focus vs. canvas focus?
            // If this isn't how I switch to command mode, then how do I?
            // Tab should be used to switch focus. Enter shall be used to toggle command mode vs chat mode
            console.log("{empty input.value submitted}")
            //this.app.focusTarget = this.app.canvas;
            let lastInputMode = this.toggleInputMode();
        }
        else
        {
            this.socket.send(JSON.stringify(new WebSocketMessage("command", this.input.value)));
            this.input.value = '';
        }
        return false; // Prevent page from submitting.
    }

    private toggleInputMode(): InputMode
    {
        let fadeTime = 10;
        let blinkTime = 25;
        let blinkCount = 3;

        switch (this.inputMode)
        {
            case InputMode.command:
                this.inputMode = InputMode.chat;
                this.app.effectsQueue.push([
                    new Effect(this.prePrompt, EffectEnum.fadeOut, fadeTime),
                    new Effect(this.prePrompt, EffectEnum.makeInvisible),
                    new Effect(this.postPrompt, EffectEnum.makeVisible),
                    new Effect(this.postPrompt, EffectEnum.fadeIn, fadeTime),
                    new Effect(this.postPrompt, EffectEnum.blink, blinkTime, blinkCount)]);
                return InputMode.command;
            case InputMode.chat:
                this.inputMode = InputMode.command
                this.app.effectsQueue.push([
                    new Effect(this.postPrompt, EffectEnum.fadeOut, fadeTime),
                    new Effect(this.postPrompt, EffectEnum.makeInvisible),
                    new Effect(this.prePrompt, EffectEnum.makeVisible),
                    new Effect(this.prePrompt, EffectEnum.fadeIn, fadeTime)]);
                return InputMode.chat;
        }
    }

    private webSocketConnect(endPoint: string)
    {
        // Create WebSocket connection
        this.socket = new WebSocket(endPoint);

        // Connection opened
        this.socket.addEventListener('open', function (event)
        {
            this.send(JSON.stringify(new WebSocketMessage("init", "Greetings!")));
        });

        // Listen for messages
        this.socket.addEventListener('message', function (event)
        {
            console.log('message from server ', event.data);
        });

        this.socket.addEventListener('close', function (event)
        {
            console.log('web socket closed');
        });
    }
}

export enum InputMode
{
    command,
    chat
}