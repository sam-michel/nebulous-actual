/**
 * The main terminal interface for capturing user text input.
 */
export class Terminal
{
    input: HTMLInputElement;

    constructor()
    {
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

        form.appendChild(div);
        div.appendChild(prompt);
        div.appendChild(this.input);

    }

}