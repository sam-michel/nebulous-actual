import { Application } from './index'
import { Effect, EffectEnum } from './effects';
import { WebSocketMessage } from '../server/web-socket-message';

/**
 * The main terminal interface for capturing user text input.
 */
export class Terminal
{
    app: Application;
    form: HTMLFormElement;
    input: HTMLInputElement;
    socket: WebSocket;

    constructor(app: Application)
    {
        this.app = app;

        // create CLI
        // at the very least I need an input field and a command history
        // also need Enter toggle for command input vs free text
        // ctrl + Back deletes all text, ctrl + x/c/v cuts, copies, and pastes text
        this.form = document.createElement("form");
        this.form.action = "command";
        this.form.style.background = "#000";
        this.form.style.padding = "3px";
        this.form.style.position = "absolute"; // "fixed"
        //this.form.style.bottom = "0";
        this.form.style.top = `${window.innerHeight - 20}px`;
        this.form.style.left = "0px";
        this.form.style.width = "100%";

        let div = document.createElement("div");

        let prompt = document.createElement("span");
        prompt.innerText = "> "
        prompt.style.fontFamily = "courier";
        prompt.style.backgroundColor = "#000";
        prompt.style.color = "#00ff00";
        prompt.style.width = "1%";
        prompt.style.whiteSpace = "nowrap";

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

        let inputHistory = document.createElement("ul");
        inputHistory.style.listStyleType = "none";
        inputHistory.style.margin = "0";
        inputHistory.style.padding = "0";

        this.form.appendChild(div);
        div.appendChild(prompt);
        div.appendChild(this.input);
        document.body.appendChild(this.form);

        // handle form submissions:
        this.form.onsubmit = (event) =>
        {
            if (this.input.value === "")
            {
                this.app.focusTarget = this.app.canvas;
                this.app.effectsQueue.push([new Effect(this.form, EffectEnum.moveTo, 20, { x: parseInt(this.form.style.left), y: 20 + parseInt(this.form.style.top) })]);
            }
            else
            {
                this.socket.send(JSON.stringify(new WebSocketMessage("command", this.input.value)));
                this.input.value = '';
            }
            return false; // Prevent page from submitting.
        }

        // Create WebSocket connection.
        this.socket = new WebSocket('ws://localhost:3001');

        // Connection opened
        this.socket.addEventListener('open', function (event)
        {
            this.send(JSON.stringify(new WebSocketMessage("init", "Greetings!")));
        });

        // Listen for messages
        this.socket.addEventListener('message', function (event)
        {
            console.log('Message from server ', event.data);
        });

        this.socket.addEventListener('close', function (event)
        {
            console.log('close');
            //socket.close();
        });
    }

}