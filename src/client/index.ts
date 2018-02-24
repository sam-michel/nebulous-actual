var canvasContext;

function start()
{
    // set body values
    document.body.style.backgroundColor = "#000000";
    document.body.style.cursor = "crosshair";
    document.body.style.font = "13px Helvetica, Arial";

    // create canvas
    let canvas = document.createElement("canvas");
    canvas.style.border = "2px solid #c3c3c3";  // sand: #fff2c4, forest: #206020
    canvas.style.backgroundColor = "black";  // sand: #fff2c4, forest: #206020
    canvas.innerHTML = "Your browser does not support the canvas element.";
    canvasContext = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    // create CLI
    // at the very least I need an input field and a command history
    // also need Enter toggle for command input vs free text
    // ctrl + Back deletes all text, ctrl + x/c/v cuts, copies, and pastes text
    let form = document.createElement("form");
    form.style.background = "#000";
    form.style.padding = "3px";
    form.style.position = "fixed";
    form.style.bottom = "0";
    form.style.width = "100%";

    let input = document.createElement("input");
    input.autocomplete = "off";

    let inputHistory = document.createElement("ul");
    inputHistory.style.listStyleType = "none";
    inputHistory.style.margin = "0";
    inputHistory.style.padding = "0";





    // create HUD

    // create mini-map

}

function resize()
{
    return false;
}

function contextMenu()
{
    return false;
}

// Do it.
window.onresize = resize;
window.oncontextmenu = contextMenu;
start();