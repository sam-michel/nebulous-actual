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
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Entry point for client
// pack with: webpack --watch
Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = __webpack_require__(1);
const web_socket_message_1 = __webpack_require__(2);
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
/* 1 */
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
/* 2 */
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
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWNjMTYzZGRlZDZjMjgxMmY5MDAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2VmZmVjdHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC93ZWItc29ja2V0LW1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUM3REEseUJBQXlCO0FBQ3pCLDZCQUE2Qjs7QUFFN0IseUNBQStDO0FBQy9DLG9EQUF3RDtBQUV4RCxJQUFJLE1BQXlCLENBQUM7QUFDOUIsSUFBSSxhQUF1QyxDQUFDO0FBQzVDLElBQUksS0FBdUIsQ0FBQztBQUM1QixJQUFJLFlBQThCLENBQUM7QUFDbkMsSUFBSSxNQUFzQixDQUFDO0FBQzNCLElBQUksWUFBWSxHQUFlLEVBQUUsQ0FBQztBQUNsQyxJQUFJLE1BQWlCLENBQUM7QUFDdEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQUN6QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxhQUFhLEdB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VSxDQUFDLEtBQUs7Z0JBQ2pCLEtBQUssQ0FBQztZQUNWLEtBQUssVUFBVSxDQUFDLE1BQU07Z0JBQ2xCLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztnQkFDekMsS0FBSyxDQUFDO1lBQ1YsS0FBSyxVQUFVLENBQUMsT0FBTztnQkFDbkIsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7Z0JBQ3pDLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0NBRUo7QUFuQ0Qsd0JBbUNDO0FBRUQsSUFBWSxVQUtYO0FBTEQsV0FBWSxVQUFVO0lBRWxCLDZDQUFLO0lBQ0wsK0NBQU07SUFDTixpREFBTztBQUNYLENBQUMsRUFMVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUtyQjs7Ozs7Ozs7OztBQzFDRDtJQUtJLFlBQVksSUFBWSxFQUFFLE9BQWU7UUFFckMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBVkQsNENBVUMiLCJmaWxlIjoibmVidWxvdXMtYWN0dWFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYWNjMTYzZGRlZDZjMjgxMmY5MDAiLCIvLyBFbnRyeSBwb2ludCBmb3IgY2xpZW50XHJcbi8vIHBhY2sgd2l0aDogd2VicGFjayAtLXdhdGNoXHJcblxyXG5pbXBvcnQgeyBFZmZlY3QsIEVmZmVjdEVudW0gfSBmcm9tICcuL2VmZmVjdHMnO1xyXG5pbXBvcnQgeyBXZWJTb2NrZXRNZXNzYWdlIH0gZnJvbSAnLi93ZWItc29ja2V0LW1lc3NhZ2UnO1xyXG5cclxudmFyIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbnZhciBjYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbnZhciBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxudmFyIGlucHV0SGlzdG9yeTogSFRNTFVMaXN0RWxlbWVudDtcclxudmFyIGZvb3RlcjogSFRNTERpdkVsZW1lbnQ7XHJcbnZhciBlZmZlY3RzUXVldWU6IEVmZmVjdFtdW10gPSBbXTtcclxudmFyIHNvY2tldDogV2ViU29ja2V0O1xyXG52YXIgbWF4RnBzID0gNjA7XHJcbnZhciBjdXJyZW50RnBzID0gMDtcclxudmFyIGN1cnJlbnRGcmFtZVJhdGUgPSAwO1xyXG52YXIgZnJhbWVDb3VudCA9IDA7XHJcbnZhciBsYXN0RnJhbWVUaW1lID0gMDtcclxudmFyIGxhc3RGcmFtZUNvdW50ID0gMDtcclxudmFyIHN0YXJ0VGltZSA9IDA7XHJcbnZhciBsYXN0TW91c2VYID0gMDtcclxudmFyIGxhc3RNb3VzZVkgPSAwO1xyXG5cclxuZnVuY3Rpb24gc3RhcnQoKVxyXG57XHJcbiAgICAvLyBzZXQgYm9keSB2YWx1ZXNcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMDAwMDAwXCI7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IFwiY3Jvc3NoYWlyXCI7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmZvbnQgPSBcIjEzcHggSGVsdmV0aWNhLCBBcmlhbFwiO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBjYW52YXNcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICBjYW52YXNDb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIGNhbnZhcy5pbm5lckhUTUwgPSBcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBjYW52YXMgZWxlbWVudC5cIjtcclxuICAgIGNhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjBcIjtcclxuICAgIC8vY2FudmFzLnN0eWxlLmJvcmRlciA9IFwiMnB4IHNvbGlkICNjM2MzYzNcIjsgIC8vIHNhbmQ6ICNmZmYyYzQsIGZvcmVzdDogIzIwNjAyMFxyXG4gICAgY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjsgIC8vIHNhbmQ6ICNmZmYyYzQsIGZvcmVzdDogIzIwNjAyMFxyXG4gICAgY2FudmFzLm9ubW91c2Vtb3ZlID0gbW91c2VNb3ZlO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBDTElcclxuICAgIC8vIGF0IHRoZSB2ZXJ5IGxlYXN0IEkgbmVlZCBhbiBpbnB1dCBmaWVsZCBhbmQgYSBjb21tYW5kIGhpc3RvcnlcclxuICAgIC8vIGFsc28gbmVlZCBFbnRlciB0b2dnbGUgZm9yIGNvbW1hbmQgaW5wdXQgdnMgZnJlZSB0ZXh0XHJcbiAgICAvLyBjdHJsICsgQmFjayBkZWxldGVzIGFsbCB0ZXh0LCBjdHJsICsgeC9jL3YgY3V0cywgY29waWVzLCBhbmQgcGFzdGVzIHRleHRcclxuICAgIGxldCBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XHJcbiAgICBmb3JtLmFjdGlvbiA9IFwiY29tbWFuZFwiO1xyXG4gICAgZm9ybS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjMDAwXCI7XHJcbiAgICBmb3JtLnN0eWxlLnBhZGRpbmcgPSBcIjNweFwiO1xyXG4gICAgZm9ybS5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcclxuICAgIGZvcm0uc3R5bGUuYm90dG9tID0gXCIwXCI7XHJcbiAgICBmb3JtLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcblxyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgbGV0IHByb21wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgcHJvbXB0LmlubmVyVGV4dCA9IFwiPiBcIlxyXG4gICAgcHJvbXB0LnN0eWxlLmZvbnRGYW1pbHkgPSBcImNvdXJpZXJcIjtcclxuICAgIHByb21wdC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMDBcIjtcclxuICAgIHByb21wdC5zdHlsZS5jb2xvciA9IFwiIzAwZmYwMFwiO1xyXG4gICAgcHJvbXB0LnN0eWxlLndpZHRoID0gXCIxJVwiO1xyXG4gICAgcHJvbXB0LnN0eWxlLndoaXRlU3BhY2UgPSBcIm5vd3JhcFwiO1xyXG5cclxuICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgaW5wdXQuYXV0b2NvbXBsZXRlID0gXCJvZmZcIjtcclxuICAgIGlucHV0LnN0eWxlLndpZHRoID0gXCI5MCVcIjtcclxuICAgIGlucHV0LnN0eWxlLmZvbnRGYW1pbHkgPSBcImNvdXJpZXJcIjtcclxuICAgIGlucHV0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzAwMFwiO1xyXG4gICAgaW5wdXQuc3R5bGUuY29sb3IgPSBcIiMwMGZmMDBcIjtcclxuICAgIGlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgaW5wdXQuc3R5bGUuYm9yZGVyID0gXCIwcHhcIjtcclxuICAgIGlucHV0LnN0eWxlLmJvcmRlcldpZHRoID0gXCIwXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5vdXRsaW5lID0gXCJub25lXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5jdXJzb3IgPSBcImNyb3NzaGFpclwiO1xyXG5cclxuICAgIGlucHV0SGlzdG9yeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcclxuICAgIGlucHV0SGlzdG9yeS5zdHlsZS5saXN0U3R5bGVUeXBlID0gXCJub25lXCI7XHJcbiAgICBpbnB1dEhpc3Rvcnkuc3R5bGUubWFyZ2luID0gXCIwXCI7XHJcbiAgICBpbnB1dEhpc3Rvcnkuc3R5bGUucGFkZGluZyA9IFwiMFwiO1xyXG5cclxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgIGRpdi5hcHBlbmRDaGlsZChwcm9tcHQpO1xyXG4gICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgcmVzaXplKCk7XHJcblxyXG4gICAgLy8gY3JlYXRlIEhVRFxyXG4gICAgLy8gZGlzcGxheSBhY3R1YWwgZnJhbWUgcmF0ZSB2cy4gbWF4IGZyYW1lIHJhdGVcclxuICAgIC8vIGRpc3BsYXkgZnJhbWUgY291bnRcclxuICAgIGZvb3RlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBmb290ZXIuc3R5bGUuY29sb3IgPSBcIiMwMGFhMDBcIjtcclxuICAgIGZvb3Rlci5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjMDAwXCI7XHJcbiAgICBmb290ZXIuc3R5bGUuZm9udFNpemUgPSBcIjhweFwiXHJcbiAgICBmb290ZXIuc3R5bGUucGFkZGluZyA9IFwiMnB4XCI7XHJcbiAgICBmb290ZXIuc3R5bGUud2lkdGggPSBcIjUlXCI7XHJcbiAgICBmb290ZXIuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XHJcbiAgICBmb290ZXIuc3R5bGUuYm90dG9tID0gXCIwXCI7XHJcbiAgICBmb290ZXIuc3R5bGUucmlnaHQgPSBcIjBcIjtcclxuICAgIGZvb3Rlci5zdHlsZS50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XHJcbiAgICBmb290ZXIuc3R5bGUud2hpdGVTcGFjZSA9IFwibm93cmFwXCI7XHJcbiAgICBmb290ZXIuaW5uZXJUZXh0ID0gXCJ0ZXN0IGZvb3RlclwiO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBtaW5pLW1hcFxyXG4gICAgLy8gcmVmcmVzaCByYXRlIGZvciBtaW5pLW1hcCB3aWxsIGJlIGluZGVwZW5kZW50bHkgY29udHJvbGxlZFxyXG5cclxuICAgIC8vIGZhZGUgc29tZSB0ZXh0IGluXHJcbiAgICBsZXQgdGl0bGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgdGl0bGVUZXh0LmlubmVyVGV4dCA9IFwibmVidWxvdXMgLyBhY3R1YWxcIlxyXG4gICAgdGl0bGVUZXh0LnN0eWxlLmZvbnRTaXplID0gXCI0OHB0XCI7XHJcbiAgICB0aXRsZVRleHQuc3R5bGUuY29sb3IgPSBcIiMwMGZmMDBcIjtcclxuICAgIHRpdGxlVGV4dC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgIHRpdGxlVGV4dC5zdHlsZS50b3AgPSBcIjE1MHB4XCI7IC8vIGNlbnRlciB0aGlzIHZlcnRpY2FsbHlcclxuICAgIHRpdGxlVGV4dC5zdHlsZS5sZWZ0ID0gXCIxNTBweFwiOyAvLyBjZW50ZXIgdGhpcyBob3Jpem9udGFsbHlcclxuICAgIGVmZmVjdHNRdWV1ZS5wdXNoKFtuZXcgRWZmZWN0KHRpdGxlVGV4dCwgRWZmZWN0RW51bS5mYWRlSW4sIDE4MCksIG5ldyBFZmZlY3QodGl0bGVUZXh0LCBFZmZlY3RFbnVtLmZhZGVPdXQsIDE4MCldKTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRpdGxlVGV4dCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGlucHV0SGlzdG9yeSk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG5cclxuICAgIC8vIHNjcm9sbCBzb21lIGluaXQgdGV4dCB3aGVuIHBhZ2UgbG9hZHNcclxuXHJcblxyXG4gICAgLy8gaGFuZGxlIGZvcm0gc3VibWlzc2lvbnM6XHJcbiAgICBmb3JtLm9uc3VibWl0ID0gZnVuY3Rpb24gc2VuZEZvcm0oZXZlbnQpXHJcbiAgICB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobmV3IFdlYlNvY2tldE1lc3NhZ2UoXCJjb21tYW5kXCIsIGlucHV0LnZhbHVlKSkpO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBQcmV2ZW50IHBhZ2UgZnJvbSBzdWJtaXR0aW5nLlxyXG4gICAgfVxyXG5cclxuICAgIC8vIENyZWF0ZSBXZWJTb2NrZXQgY29ubmVjdGlvbi5cclxuICAgIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjMwMDEnKTtcclxuXHJcbiAgICAvLyBDb25uZWN0aW9uIG9wZW5lZFxyXG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCBmdW5jdGlvbiAoZXZlbnQpXHJcbiAgICB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoJ0hlbGxvIFNlcnZlciEnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIExpc3RlbiBmb3IgbWVzc2FnZXNcclxuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIGZyb20gc2VydmVyICcsIGV2ZW50LmRhdGEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgZnVuY3Rpb24gKGV2ZW50KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjbG9zZScpO1xyXG4gICAgICAgIHNvY2tldC5jbG9zZSgpO1xyXG4gICAgfSk7XHJcbiAgICBydW5Mb29wKCk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBydW5Mb29wKClcclxue1xyXG4gICAgLy8gZG8gc2hpdFxyXG5cclxuICAgIC8vIGNoZWNrIGRyYXcgcXVldWUgKHNoYXBlcywgbGluZXMsIGdseXBocywgZXRjLilcclxuXHJcbiAgICAvLyB1cGRhdGUgSFVEXHJcbiAgICAvLyBzZXQgcmVmcmVzaCByYXRlIGZvciBIVUQgLS0gZG9lc24ndCBuZWVkIHRvIGJlIGV2ZXJ5IGZyYW1lXHJcbiAgICBsZXQgdGltZVN0YW1wSW5NcyA9IHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ICYmIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcgJiYgd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgPyB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgKyB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydCA6IERhdGUubm93KCk7XHJcbiAgICBpZiAoc3RhcnRUaW1lID09PSAwKVxyXG4gICAge1xyXG4gICAgICAgIHN0YXJ0VGltZSA9IHRpbWVTdGFtcEluTXM7XHJcbiAgICB9XHJcbiAgICBpZiAoMCA9PT0gZnJhbWVDb3VudCAlIDMwKVxyXG4gICAge1xyXG4gICAgICAgIGN1cnJlbnRGcHMgPSBNYXRoLmZsb29yKDEwMDAgKiAoZnJhbWVDb3VudCAtIGxhc3RGcmFtZUNvdW50KSAvICh0aW1lU3RhbXBJbk1zIC0gbGFzdEZyYW1lVGltZSkpO1xyXG4gICAgfVxyXG4gICAgLy9mb290ZXIuaW5uZXJUZXh0ID0gYCR7ZnJhbWVDb3VudH0gJHtNYXRoLmZsb29yKHRpbWVTdGFtcEluTXMgLSBzdGFydFRpbWUpfSAke2Zwc30vJHttYXhGcHN9YDtcclxuICAgIGZvb3Rlci5pbm5lclRleHQgPSBgJHtsYXN0TW91c2VYfSAke2xhc3RNb3VzZVl9ICR7Y3VycmVudEZwc30vJHttYXhGcHN9YDtcclxuICAgIGxhc3RGcmFtZVRpbWUgPSB0aW1lU3RhbXBJbk1zO1xyXG4gICAgbGFzdEZyYW1lQ291bnQgPSBmcmFtZUNvdW50O1xyXG5cclxuICAgIC8vIGNoZWNrIGVmZmVjdHMgcXVldWVcclxuICAgIGxldCBuZXdRdWV1ZTogRWZmZWN0W11bXSA9IFtdO1xyXG4gICAgZWZmZWN0c1F1ZXVlLmZvckVhY2goZWZmZWN0Q2hhaW4gPT5cclxuICAgIHtcclxuICAgICAgICBsZXQgZWZmZWN0ID0gZWZmZWN0Q2hhaW4uc2hpZnQoKTtcclxuICAgICAgICBpZiAoZWZmZWN0LmFkdmFuY2UoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGVmZmVjdENoYWluLnVuc2hpZnQoZWZmZWN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKDAgPCBlZmZlY3RDaGFpbi5sZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXdRdWV1ZS5wdXNoKGVmZmVjdENoYWluKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGVmZmVjdHNRdWV1ZSA9IG5ld1F1ZXVlO1xyXG4gICAgc2V0VGltZW91dChydW5Mb29wLCAxMDAwIC8gbWF4RnBzKTtcclxuICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICBmcmFtZUNvdW50Kys7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZSgpXHJcbntcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMjA7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMjU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnRleHRNZW51KClcclxue1xyXG4gICAgLy8gZHJhdyBteSBvd24gY29udGV4dCBtZW51IVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtb3VzZU1vdmUobW91c2VFdmVudDogTW91c2VFdmVudClcclxue1xyXG4gICAgbGFzdE1vdXNlWCA9IG1vdXNlRXZlbnQueDtcclxuICAgIGxhc3RNb3VzZVkgPSBtb3VzZUV2ZW50Lnk7XHJcbiAgICAvL3NvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG5ldyBXZWJTb2NrZXRNZXNzYWdlKFwibW91c2VNb3ZlXCIsIGAke2xhc3RNb3VzZVh9LCR7bGFzdE1vdXNlWX1gKSkpO1xyXG59XHJcblxyXG4vLyBEbyBpdC5cclxud2luZG93Lm9ucmVzaXplID0gcmVzaXplO1xyXG53aW5kb3cub25jb250ZXh0bWVudSA9IGNvbnRleHRNZW51O1xyXG5zdGFydCgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGllbnQvaW5kZXgudHMiLCJleHBvcnQgY2xhc3MgRWZmZWN0XHJcbntcclxuICAgIHRhcmdldDogSFRNTEVsZW1lbnQ7XHJcbiAgICBlZmZlY3Q6IEVmZmVjdEVudW07XHJcbiAgICBsaWZlTWF4OiBudW1iZXI7IC8vIGluaXRpYWwgbGlmZVxyXG4gICAgbGlmZUN1cnJlbnQ6IG51bWJlcjsgLy8gY3VycmVudCB0aW1lIGxlZnRcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQ6IEhUTUxFbGVtZW50LCBlZmZlY3Q6IEVmZmVjdEVudW0sIGxpZmVNYXg6IG51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLmVmZmVjdCA9IGVmZmVjdDtcclxuICAgICAgICB0aGlzLmxpZmVNYXggPSBsaWZlTWF4O1xyXG4gICAgICAgIHRoaXMubGlmZUN1cnJlbnQgPSBsaWZlTWF4O1xyXG4gICAgfVxyXG5cclxuICAgIGFkdmFuY2UoKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIGxldCBvcGFjaXR5O1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5lZmZlY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIEVmZmVjdEVudW0uYmxpbms6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFZmZlY3RFbnVtLmZhZGVJbjpcclxuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSAxIC0gdGhpcy5saWZlQ3VycmVudCAvIHRoaXMubGlmZU1heDtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSBgJHtvcGFjaXR5fWA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFZmZlY3RFbnVtLmZhZGVPdXQ6XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gdGhpcy5saWZlQ3VycmVudCAvIHRoaXMubGlmZU1heDtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSBgJHtvcGFjaXR5fWA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAwIDwgdGhpcy5saWZlQ3VycmVudC0tO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGVudW0gRWZmZWN0RW51bVxyXG57XHJcbiAgICBibGluayxcclxuICAgIGZhZGVJbixcclxuICAgIGZhZGVPdXRcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGllbnQvZWZmZWN0cy50cyIsImV4cG9ydCBjbGFzcyBXZWJTb2NrZXRNZXNzYWdlXHJcbntcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZylcclxuICAgIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xpZW50L3dlYi1zb2NrZXQtbWVzc2FnZS50cyJdLCJzb3VyY2VSb290IjoiIn0=