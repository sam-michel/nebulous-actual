/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = __webpack_require__(1);
const web_socket_message_1 = __webpack_require__(308);
var canvas;
var canvasContext;
var input;
var inputHistory;
var footer;
var effectsQueue = [];
var socket;
var maxFps = 60;
var currentFps = 0;
var currentFrameRate = 0;
var frameCount = 0;
var lastFrameTime = 0;
var lastFrameCount = 0;
var startTime = 0;
var lastMouseX = 0;
var lastMouseY = 0;
function start() {
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
    canvas.style.backgroundColor = "black"; // sand: #fff2c4, forest: #206020
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
    prompt.innerText = "> ";
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
    footer.style.fontSize = "8px";
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
    titleText.innerText = "nebulous / actual";
    titleText.style.fontSize = "48pt";
    titleText.style.color = "#00ff00";
    titleText.style.position = "absolute";
    titleText.style.top = "150px"; // center this vertically
    titleText.style.left = "150px"; // center this horizontally
    effectsQueue.push([new effects_1.Effect(titleText, effects_1.EffectEnum.fadeIn, 180), new effects_1.Effect(titleText, effects_1.EffectEnum.fadeOut, 180)]);
    document.body.appendChild(titleText);
    document.body.appendChild(canvas);
    document.body.appendChild(inputHistory);
    document.body.appendChild(form);
    document.body.appendChild(footer);
    // scroll some init text when page loads
    // handle form submissions:
    form.onsubmit = function sendForm(event) {
        socket.send(JSON.stringify(new web_socket_message_1.WebSocketMessage("command", input.value)));
        input.value = '';
        return false; // Prevent page from submitting.
    };
    // Create WebSocket connection.
    socket = new WebSocket('ws://localhost:3001');
    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
    });
    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });
    socket.addEventListener('close', function (event) {
        console.log('close');
        socket.close();
    });
    runLoop();
}
function runLoop() {
    // do shit
    // check draw queue (shapes, lines, glyphs, etc.)
    // update HUD
    // set refresh rate for HUD -- doesn't need to be every frame
    let timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
    if (startTime === 0) {
        startTime = timeStampInMs;
    }
    if (0 === frameCount % 30) {
        currentFps = Math.floor(1000 * (frameCount - lastFrameCount) / (timeStampInMs - lastFrameTime));
    }
    //footer.innerText = `${frameCount} ${Math.floor(timeStampInMs - startTime)} ${fps}/${maxFps}`;
    footer.innerText = `${lastMouseX} ${lastMouseY} ${currentFps}/${maxFps}`;
    lastFrameTime = timeStampInMs;
    lastFrameCount = frameCount;
    // check effects queue
    let newQueue = [];
    effectsQueue.forEach(effectChain => {
        let effect = effectChain.shift();
        if (effect.advance()) {
            effectChain.unshift(effect);
        }
        if (0 < effectChain.length) {
            newQueue.push(effectChain);
        }
    });
    effectsQueue = newQueue;
    setTimeout(runLoop, 1000 / maxFps);
    input.focus();
    frameCount++;
}
function resize() {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 25;
}
function contextMenu() {
    // draw my own context menu!
    return false;
}
function mouseMove(mouseEvent) {
    lastMouseX = mouseEvent.x;
    lastMouseY = mouseEvent.y;
    //socket.send(JSON.stringify(new WebSocketMessage("mouseMove", `${lastMouseX},${lastMouseY}`)));
}
// Do it.
window.onresize = resize;
window.oncontextmenu = contextMenu;
start();


/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Effect {
    constructor(target, effect, lifeMax) {
        this.target = target;
        this.effect = effect;
        this.lifeMax = lifeMax;
        this.lifeCurrent = lifeMax;
    }
    advance() {
        let opacity;
        switch (this.effect) {
            case EffectEnum.blink:
                break;
            case EffectEnum.fadeIn:
                opacity = 1 - this.lifeCurrent / this.lifeMax;
                this.target.style.opacity = `${opacity}`;
                break;
            case EffectEnum.fadeOut:
                opacity = this.lifeCurrent / this.lifeMax;
                this.target.style.opacity = `${opacity}`;
                break;
        }
        return 0 < this.lifeCurrent--;
    }
}
exports.Effect = Effect;
var EffectEnum;
(function (EffectEnum) {
    EffectEnum[EffectEnum["blink"] = 0] = "blink";
    EffectEnum[EffectEnum["fadeIn"] = 1] = "fadeIn";
    EffectEnum[EffectEnum["fadeOut"] = 2] = "fadeOut";
})(EffectEnum = exports.EffectEnum || (exports.EffectEnum = {}));


/***/ }),

/***/ 308:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class WebSocketMessage {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}
exports.WebSocketMessage = WebSocketMessage;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGMyMjkwMzQ5N2E0YzNjNWE5YjYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2VmZmVjdHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC93ZWItc29ja2V0LW1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQzdEQSx5Q0FBK0M7QUFDL0Msc0RBQXdEO0FBR3hELElBQUksTUFBeUIsQ0FBQztBQUM5QixJQUFJLGFBQXVDLENBQUM7QUFDNUMsSUFBSSxLQUF1QixDQUFDO0FBQzVCLElBQUksWUFBOEIsQ0FBQztBQUNuQyxJQUFJLE1BQXNCLENBQUM7QUFDM0IsSUFBSSxZQUFZLEdBQWUsRUFBRSxDQUFDO0FBQ2xDLElBQUksTUFBaUIsQ0FBQztBQUN0QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdEIsSUFBSSxj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Q0FBQztZQUNWLEtBQUssVUFBVSxDQUFDLE1BQU07Z0JBQ2xCLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztnQkFDekMsS0FBSyxDQUFDO1lBQ1YsS0FBSyxVQUFVLENBQUMsT0FBTztnQkFDbkIsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7Z0JBQ3pDLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0NBRUo7QUFuQ0Qsd0JBbUNDO0FBRUQsSUFBWSxVQUtYO0FBTEQsV0FBWSxVQUFVO0lBRWxCLDZDQUFLO0lBQ0wsK0NBQU07SUFDTixpREFBTztBQUNYLENBQUMsRUFMVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUtyQjs7Ozs7Ozs7Ozs7QUMxQ0Q7SUFLSSxZQUFZLElBQVksRUFBRSxPQUFlO1FBRXJDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQVZELDRDQVVDIiwiZmlsZSI6Im5lYnVsb3VzLWFjdHVhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDBjMjI5MDM0OTdhNGMzYzVhOWI2IiwiaW1wb3J0IHsgRWZmZWN0LCBFZmZlY3RFbnVtIH0gZnJvbSAnLi9lZmZlY3RzJztcclxuaW1wb3J0IHsgV2ViU29ja2V0TWVzc2FnZSB9IGZyb20gJy4vd2ViLXNvY2tldC1tZXNzYWdlJztcclxuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcclxuXHJcbnZhciBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG52YXIgY2FudmFzQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG52YXIgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbnZhciBpbnB1dEhpc3Rvcnk6IEhUTUxVTGlzdEVsZW1lbnQ7XHJcbnZhciBmb290ZXI6IEhUTUxEaXZFbGVtZW50O1xyXG52YXIgZWZmZWN0c1F1ZXVlOiBFZmZlY3RbXVtdID0gW107XHJcbnZhciBzb2NrZXQ6IFdlYlNvY2tldDtcclxudmFyIG1heEZwcyA9IDYwO1xyXG52YXIgY3VycmVudEZwcyA9IDA7XHJcbnZhciBjdXJyZW50RnJhbWVSYXRlID0gMDtcclxudmFyIGZyYW1lQ291bnQgPSAwO1xyXG52YXIgbGFzdEZyYW1lVGltZSA9IDA7XHJcbnZhciBsYXN0RnJhbWVDb3VudCA9IDA7XHJcbnZhciBzdGFydFRpbWUgPSAwO1xyXG52YXIgbGFzdE1vdXNlWCA9IDA7XHJcbnZhciBsYXN0TW91c2VZID0gMDtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KClcclxue1xyXG4gICAgLy8gc2V0IGJvZHkgdmFsdWVzXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzAwMDAwMFwiO1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSBcImNyb3NzaGFpclwiO1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5mb250ID0gXCIxM3B4IEhlbHZldGljYSwgQXJpYWxcIjtcclxuXHJcbiAgICAvLyBjcmVhdGUgY2FudmFzXHJcbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgY2FudmFzQ29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICBjYW52YXMuaW5uZXJIVE1MID0gXCJZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgY2FudmFzIGVsZW1lbnQuXCI7XHJcbiAgICBjYW52YXMuc3R5bGUuYm9yZGVyID0gXCIwXCI7XHJcbiAgICAvL2NhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjJweCBzb2xpZCAjYzNjM2MzXCI7ICAvLyBzYW5kOiAjZmZmMmM0LCBmb3Jlc3Q6ICMyMDYwMjBcclxuICAgIGNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7ICAvLyBzYW5kOiAjZmZmMmM0LCBmb3Jlc3Q6ICMyMDYwMjBcclxuICAgIGNhbnZhcy5vbm1vdXNlbW92ZSA9IG1vdXNlTW92ZTtcclxuXHJcbiAgICAvLyBjcmVhdGUgQ0xJXHJcbiAgICAvLyBhdCB0aGUgdmVyeSBsZWFzdCBJIG5lZWQgYW4gaW5wdXQgZmllbGQgYW5kIGEgY29tbWFuZCBoaXN0b3J5XHJcbiAgICAvLyBhbHNvIG5lZWQgRW50ZXIgdG9nZ2xlIGZvciBjb21tYW5kIGlucHV0IHZzIGZyZWUgdGV4dFxyXG4gICAgLy8gY3RybCArIEJhY2sgZGVsZXRlcyBhbGwgdGV4dCwgY3RybCArIHgvYy92IGN1dHMsIGNvcGllcywgYW5kIHBhc3RlcyB0ZXh0XHJcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xyXG4gICAgZm9ybS5hY3Rpb24gPSBcImNvbW1hbmRcIjtcclxuICAgIGZvcm0uc3R5bGUuYmFja2dyb3VuZCA9IFwiIzAwMFwiO1xyXG4gICAgZm9ybS5zdHlsZS5wYWRkaW5nID0gXCIzcHhcIjtcclxuICAgIGZvcm0uc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XHJcbiAgICBmb3JtLnN0eWxlLmJvdHRvbSA9IFwiMFwiO1xyXG4gICAgZm9ybS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG5cclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIGxldCBwcm9tcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHByb21wdC5pbm5lclRleHQgPSBcIj4gXCJcclxuICAgIHByb21wdC5zdHlsZS5mb250RmFtaWx5ID0gXCJjb3VyaWVyXCI7XHJcbiAgICBwcm9tcHQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMDAwXCI7XHJcbiAgICBwcm9tcHQuc3R5bGUuY29sb3IgPSBcIiMwMGZmMDBcIjtcclxuICAgIHByb21wdC5zdHlsZS53aWR0aCA9IFwiMSVcIjtcclxuICAgIHByb21wdC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcclxuXHJcbiAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIGlucHV0LmF1dG9jb21wbGV0ZSA9IFwib2ZmXCI7XHJcbiAgICBpbnB1dC5zdHlsZS53aWR0aCA9IFwiOTAlXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5mb250RmFtaWx5ID0gXCJjb3VyaWVyXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMDBcIjtcclxuICAgIGlucHV0LnN0eWxlLmNvbG9yID0gXCIjMDBmZjAwXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgIGlucHV0LnN0eWxlLmJvcmRlciA9IFwiMHB4XCI7XHJcbiAgICBpbnB1dC5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMFwiO1xyXG4gICAgaW5wdXQuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xyXG4gICAgaW5wdXQuc3R5bGUuY3Vyc29yID0gXCJjcm9zc2hhaXJcIjtcclxuXHJcbiAgICBpbnB1dEhpc3RvcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XHJcbiAgICBpbnB1dEhpc3Rvcnkuc3R5bGUubGlzdFN0eWxlVHlwZSA9IFwibm9uZVwiO1xyXG4gICAgaW5wdXRIaXN0b3J5LnN0eWxlLm1hcmdpbiA9IFwiMFwiO1xyXG4gICAgaW5wdXRIaXN0b3J5LnN0eWxlLnBhZGRpbmcgPSBcIjBcIjtcclxuXHJcbiAgICBmb3JtLmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICBkaXYuYXBwZW5kQ2hpbGQocHJvbXB0KTtcclxuICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG4gICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIHJlc2l6ZSgpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBIVURcclxuICAgIC8vIGRpc3BsYXkgYWN0dWFsIGZyYW1lIHJhdGUgdnMuIG1heCBmcmFtZSByYXRlXHJcbiAgICAvLyBkaXNwbGF5IGZyYW1lIGNvdW50XHJcbiAgICBmb290ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZm9vdGVyLnN0eWxlLmNvbG9yID0gXCIjMDBhYTAwXCI7XHJcbiAgICBmb290ZXIuc3R5bGUuYmFja2dyb3VuZCA9IFwiIzAwMFwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLmZvbnRTaXplID0gXCI4cHhcIlxyXG4gICAgZm9vdGVyLnN0eWxlLnBhZGRpbmcgPSBcIjJweFwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLndpZHRoID0gXCI1JVwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLmJvdHRvbSA9IFwiMFwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLnJpZ2h0ID0gXCIwXCI7XHJcbiAgICBmb290ZXIuc3R5bGUudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xyXG4gICAgZm9vdGVyLmlubmVyVGV4dCA9IFwidGVzdCBmb290ZXJcIjtcclxuXHJcbiAgICAvLyBjcmVhdGUgbWluaS1tYXBcclxuICAgIC8vIHJlZnJlc2ggcmF0ZSBmb3IgbWluaS1tYXAgd2lsbCBiZSBpbmRlcGVuZGVudGx5IGNvbnRyb2xsZWRcclxuXHJcbiAgICAvLyBmYWRlIHNvbWUgdGV4dCBpblxyXG4gICAgbGV0IHRpdGxlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIHRpdGxlVGV4dC5pbm5lclRleHQgPSBcIm5lYnVsb3VzIC8gYWN0dWFsXCJcclxuICAgIHRpdGxlVGV4dC5zdHlsZS5mb250U2l6ZSA9IFwiNDhwdFwiO1xyXG4gICAgdGl0bGVUZXh0LnN0eWxlLmNvbG9yID0gXCIjMDBmZjAwXCI7XHJcbiAgICB0aXRsZVRleHQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICB0aXRsZVRleHQuc3R5bGUudG9wID0gXCIxNTBweFwiOyAvLyBjZW50ZXIgdGhpcyB2ZXJ0aWNhbGx5XHJcbiAgICB0aXRsZVRleHQuc3R5bGUubGVmdCA9IFwiMTUwcHhcIjsgLy8gY2VudGVyIHRoaXMgaG9yaXpvbnRhbGx5XHJcbiAgICBlZmZlY3RzUXVldWUucHVzaChbbmV3IEVmZmVjdCh0aXRsZVRleHQsIEVmZmVjdEVudW0uZmFkZUluLCAxODApLCBuZXcgRWZmZWN0KHRpdGxlVGV4dCwgRWZmZWN0RW51bS5mYWRlT3V0LCAxODApXSk7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aXRsZVRleHQpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dEhpc3RvcnkpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9vdGVyKTtcclxuXHJcbiAgICAvLyBzY3JvbGwgc29tZSBpbml0IHRleHQgd2hlbiBwYWdlIGxvYWRzXHJcblxyXG5cclxuICAgIC8vIGhhbmRsZSBmb3JtIHN1Ym1pc3Npb25zOlxyXG4gICAgZm9ybS5vbnN1Ym1pdCA9IGZ1bmN0aW9uIHNlbmRGb3JtKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBXZWJTb2NrZXRNZXNzYWdlKFwiY29tbWFuZFwiLCBpbnB1dC52YWx1ZSkpKTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gUHJldmVudCBwYWdlIGZyb20gc3VibWl0dGluZy5cclxuICAgIH1cclxuXHJcbiAgICAvLyBDcmVhdGUgV2ViU29ja2V0IGNvbm5lY3Rpb24uXHJcbiAgICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDozMDAxJyk7XHJcblxyXG4gICAgLy8gQ29ubmVjdGlvbiBvcGVuZWRcclxuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdvcGVuJywgZnVuY3Rpb24gKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIHNvY2tldC5zZW5kKCdIZWxsbyBTZXJ2ZXIhJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMaXN0ZW4gZm9yIG1lc3NhZ2VzXHJcbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudClcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTWVzc2FnZSBmcm9tIHNlcnZlciAnLCBldmVudC5kYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsIGZ1bmN0aW9uIChldmVudClcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2xvc2UnKTtcclxuICAgICAgICBzb2NrZXQuY2xvc2UoKTtcclxuICAgIH0pO1xyXG4gICAgcnVuTG9vcCgpO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gcnVuTG9vcCgpXHJcbntcclxuICAgIC8vIGRvIHNoaXRcclxuXHJcbiAgICAvLyBjaGVjayBkcmF3IHF1ZXVlIChzaGFwZXMsIGxpbmVzLCBnbHlwaHMsIGV0Yy4pXHJcblxyXG4gICAgLy8gdXBkYXRlIEhVRFxyXG4gICAgLy8gc2V0IHJlZnJlc2ggcmF0ZSBmb3IgSFVEIC0tIGRvZXNuJ3QgbmVlZCB0byBiZSBldmVyeSBmcmFtZVxyXG4gICAgbGV0IHRpbWVTdGFtcEluTXMgPSB3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyAmJiB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nICYmIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ID8gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpICsgd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgOiBEYXRlLm5vdygpO1xyXG4gICAgaWYgKHN0YXJ0VGltZSA9PT0gMClcclxuICAgIHtcclxuICAgICAgICBzdGFydFRpbWUgPSB0aW1lU3RhbXBJbk1zO1xyXG4gICAgfVxyXG4gICAgaWYgKDAgPT09IGZyYW1lQ291bnQgJSAzMClcclxuICAgIHtcclxuICAgICAgICBjdXJyZW50RnBzID0gTWF0aC5mbG9vcigxMDAwICogKGZyYW1lQ291bnQgLSBsYXN0RnJhbWVDb3VudCkgLyAodGltZVN0YW1wSW5NcyAtIGxhc3RGcmFtZVRpbWUpKTtcclxuICAgIH1cclxuICAgIC8vZm9vdGVyLmlubmVyVGV4dCA9IGAke2ZyYW1lQ291bnR9ICR7TWF0aC5mbG9vcih0aW1lU3RhbXBJbk1zIC0gc3RhcnRUaW1lKX0gJHtmcHN9LyR7bWF4RnBzfWA7XHJcbiAgICBmb290ZXIuaW5uZXJUZXh0ID0gYCR7bGFzdE1vdXNlWH0gJHtsYXN0TW91c2VZfSAke2N1cnJlbnRGcHN9LyR7bWF4RnBzfWA7XHJcbiAgICBsYXN0RnJhbWVUaW1lID0gdGltZVN0YW1wSW5NcztcclxuICAgIGxhc3RGcmFtZUNvdW50ID0gZnJhbWVDb3VudDtcclxuXHJcbiAgICAvLyBjaGVjayBlZmZlY3RzIHF1ZXVlXHJcbiAgICBsZXQgbmV3UXVldWU6IEVmZmVjdFtdW10gPSBbXTtcclxuICAgIGVmZmVjdHNRdWV1ZS5mb3JFYWNoKGVmZmVjdENoYWluID0+XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGVmZmVjdCA9IGVmZmVjdENoYWluLnNoaWZ0KCk7XHJcbiAgICAgICAgaWYgKGVmZmVjdC5hZHZhbmNlKCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBlZmZlY3RDaGFpbi51bnNoaWZ0KGVmZmVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgwIDwgZWZmZWN0Q2hhaW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmV3UXVldWUucHVzaChlZmZlY3RDaGFpbik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBlZmZlY3RzUXVldWUgPSBuZXdRdWV1ZTtcclxuICAgIHNldFRpbWVvdXQocnVuTG9vcCwgMTAwMCAvIG1heEZwcyk7XHJcbiAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgZnJhbWVDb3VudCsrO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNpemUoKVxyXG57XHJcbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDIwO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDI1O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb250ZXh0TWVudSgpXHJcbntcclxuICAgIC8vIGRyYXcgbXkgb3duIGNvbnRleHQgbWVudSFcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbW91c2VNb3ZlKG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQpXHJcbntcclxuICAgIGxhc3RNb3VzZVggPSBtb3VzZUV2ZW50Lng7XHJcbiAgICBsYXN0TW91c2VZID0gbW91c2VFdmVudC55O1xyXG4gICAgLy9zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShuZXcgV2ViU29ja2V0TWVzc2FnZShcIm1vdXNlTW92ZVwiLCBgJHtsYXN0TW91c2VYfSwke2xhc3RNb3VzZVl9YCkpKTtcclxufVxyXG5cclxuLy8gRG8gaXQuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IHJlc2l6ZTtcclxud2luZG93Lm9uY29udGV4dG1lbnUgPSBjb250ZXh0TWVudTtcclxuc3RhcnQoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xpZW50L2luZGV4LnRzIiwiZXhwb3J0IGNsYXNzIEVmZmVjdFxyXG57XHJcbiAgICB0YXJnZXQ6IEhUTUxFbGVtZW50O1xyXG4gICAgZWZmZWN0OiBFZmZlY3RFbnVtO1xyXG4gICAgbGlmZU1heDogbnVtYmVyOyAvLyBpbml0aWFsIGxpZmVcclxuICAgIGxpZmVDdXJyZW50OiBudW1iZXI7IC8vIGN1cnJlbnQgdGltZSBsZWZ0XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0OiBIVE1MRWxlbWVudCwgZWZmZWN0OiBFZmZlY3RFbnVtLCBsaWZlTWF4OiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5lZmZlY3QgPSBlZmZlY3Q7XHJcbiAgICAgICAgdGhpcy5saWZlTWF4ID0gbGlmZU1heDtcclxuICAgICAgICB0aGlzLmxpZmVDdXJyZW50ID0gbGlmZU1heDtcclxuICAgIH1cclxuXHJcbiAgICBhZHZhbmNlKCk6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICBsZXQgb3BhY2l0eTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZWZmZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSBFZmZlY3RFbnVtLmJsaW5rOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRWZmZWN0RW51bS5mYWRlSW46XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gMSAtIHRoaXMubGlmZUN1cnJlbnQgLyB0aGlzLmxpZmVNYXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gYCR7b3BhY2l0eX1gO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRWZmZWN0RW51bS5mYWRlT3V0OlxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eSA9IHRoaXMubGlmZUN1cnJlbnQgLyB0aGlzLmxpZmVNYXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gYCR7b3BhY2l0eX1gO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gMCA8IHRoaXMubGlmZUN1cnJlbnQtLTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEVmZmVjdEVudW1cclxue1xyXG4gICAgYmxpbmssXHJcbiAgICBmYWRlSW4sXHJcbiAgICBmYWRlT3V0XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xpZW50L2VmZmVjdHMudHMiLCJleHBvcnQgY2xhc3MgV2ViU29ja2V0TWVzc2FnZVxyXG57XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsaWVudC93ZWItc29ja2V0LW1lc3NhZ2UudHMiXSwic291cmNlUm9vdCI6IiJ9