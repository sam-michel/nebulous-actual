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

Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = __webpack_require__(1);
var canvas;
var canvasContext;
var input;
var footer;
var effectsQueue = [];
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
    input.style.cursor = "crosshair";
    let inputHistory = document.createElement("ul");
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
    document.body.appendChild(form);
    document.body.appendChild(footer);
    // scroll some init text when page loads
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWUyMzVlYTlhYTJlYjRhMGJlNzciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2VmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBLHlDQUErQztBQUUvQyxJQUFJLE1BQXlCLENBQUM7QUFDOUIsSUFBSSxhQUF1QyxDQUFDO0FBQzVDLElBQUksS0FBdUIsQ0FBQztBQUM1QixJQUFJLE1BQXNCLENBQUM7QUFDM0IsSUFBSSxZQUFZLEdBQWUsRUFBRSxDQUFDO0FBQ2xDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFDekIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFJLFVBQVUsR0FBRyxDQUFD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QUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO2dCQUN6QyxLQUFLLENBQUM7WUFDVixLQUFLLFVBQVUsQ0FBQyxPQUFPO2dCQUNuQixPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztnQkFDekMsS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7Q0FFSjtBQW5DRCx3QkFtQ0M7QUFFRCxJQUFZLFVBS1g7QUFMRCxXQUFZLFVBQVU7SUFFbEIsNkNBQUs7SUFDTCwrQ0FBTTtJQUNOLGlEQUFPO0FBQ1gsQ0FBQyxFQUxXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBS3JCIiwiZmlsZSI6Im5lYnVsb3VzLWFjdHVhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDVlMjM1ZWE5YWEyZWI0YTBiZTc3IiwiaW1wb3J0IHsgRWZmZWN0LCBFZmZlY3RFbnVtIH0gZnJvbSAnLi9lZmZlY3RzJztcclxuXHJcbnZhciBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG52YXIgY2FudmFzQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG52YXIgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbnZhciBmb290ZXI6IEhUTUxEaXZFbGVtZW50O1xyXG52YXIgZWZmZWN0c1F1ZXVlOiBFZmZlY3RbXVtdID0gW107XHJcbnZhciBtYXhGcHMgPSA2MDtcclxudmFyIGN1cnJlbnRGcHMgPSAwO1xyXG52YXIgY3VycmVudEZyYW1lUmF0ZSA9IDA7XHJcbnZhciBmcmFtZUNvdW50ID0gMDtcclxudmFyIGxhc3RGcmFtZVRpbWUgPSAwO1xyXG52YXIgbGFzdEZyYW1lQ291bnQgPSAwO1xyXG52YXIgc3RhcnRUaW1lID0gMDtcclxudmFyIGxhc3RNb3VzZVggPSAwO1xyXG52YXIgbGFzdE1vdXNlWSA9IDA7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpXHJcbntcclxuICAgIC8vIHNldCBib2R5IHZhbHVlc1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMDAwMDBcIjtcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJjcm9zc2hhaXJcIjtcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuZm9udCA9IFwiMTNweCBIZWx2ZXRpY2EsIEFyaWFsXCI7XHJcblxyXG4gICAgLy8gY3JlYXRlIGNhbnZhc1xyXG4gICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIGNhbnZhc0NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgY2FudmFzLmlubmVySFRNTCA9IFwiWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlIGNhbnZhcyBlbGVtZW50LlwiO1xyXG4gICAgY2FudmFzLnN0eWxlLmJvcmRlciA9IFwiMFwiO1xyXG4gICAgLy9jYW52YXMuc3R5bGUuYm9yZGVyID0gXCIycHggc29saWQgI2MzYzNjM1wiOyAgLy8gc2FuZDogI2ZmZjJjNCwgZm9yZXN0OiAjMjA2MDIwXHJcbiAgICBjYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiOyAgLy8gc2FuZDogI2ZmZjJjNCwgZm9yZXN0OiAjMjA2MDIwXHJcbiAgICBjYW52YXMub25tb3VzZW1vdmUgPSBtb3VzZU1vdmU7XHJcblxyXG4gICAgLy8gY3JlYXRlIENMSVxyXG4gICAgLy8gYXQgdGhlIHZlcnkgbGVhc3QgSSBuZWVkIGFuIGlucHV0IGZpZWxkIGFuZCBhIGNvbW1hbmQgaGlzdG9yeVxyXG4gICAgLy8gYWxzbyBuZWVkIEVudGVyIHRvZ2dsZSBmb3IgY29tbWFuZCBpbnB1dCB2cyBmcmVlIHRleHRcclxuICAgIC8vIGN0cmwgKyBCYWNrIGRlbGV0ZXMgYWxsIHRleHQsIGN0cmwgKyB4L2MvdiBjdXRzLCBjb3BpZXMsIGFuZCBwYXN0ZXMgdGV4dFxyXG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIGZvcm0uc3R5bGUuYmFja2dyb3VuZCA9IFwiIzAwMFwiO1xyXG4gICAgZm9ybS5zdHlsZS5wYWRkaW5nID0gXCIzcHhcIjtcclxuICAgIGZvcm0uc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XHJcbiAgICBmb3JtLnN0eWxlLmJvdHRvbSA9IFwiMFwiO1xyXG4gICAgZm9ybS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG5cclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIGxldCBwcm9tcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHByb21wdC5pbm5lclRleHQgPSBcIj4gXCJcclxuICAgIHByb21wdC5zdHlsZS5mb250RmFtaWx5ID0gXCJjb3VyaWVyXCI7XHJcbiAgICBwcm9tcHQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMDAwXCI7XHJcbiAgICBwcm9tcHQuc3R5bGUuY29sb3IgPSBcIiMwMGZmMDBcIjtcclxuICAgIHByb21wdC5zdHlsZS53aWR0aCA9IFwiMSVcIjtcclxuICAgIHByb21wdC5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcclxuXHJcbiAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIGlucHV0LmF1dG9jb21wbGV0ZSA9IFwib2ZmXCI7XHJcbiAgICBpbnB1dC5zdHlsZS53aWR0aCA9IFwiOTAlXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5mb250RmFtaWx5ID0gXCJjb3VyaWVyXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMDBcIjtcclxuICAgIGlucHV0LnN0eWxlLmNvbG9yID0gXCIjMDBmZjAwXCI7XHJcbiAgICBpbnB1dC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgIGlucHV0LnN0eWxlLmJvcmRlciA9IFwiMHB4XCI7XHJcbiAgICBpbnB1dC5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMFwiO1xyXG4gICAgaW5wdXQuc3R5bGUuY3Vyc29yID0gXCJjcm9zc2hhaXJcIjtcclxuXHJcbiAgICBsZXQgaW5wdXRIaXN0b3J5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgaW5wdXRIaXN0b3J5LnN0eWxlLmxpc3RTdHlsZVR5cGUgPSBcIm5vbmVcIjtcclxuICAgIGlucHV0SGlzdG9yeS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcclxuICAgIGlucHV0SGlzdG9yeS5zdHlsZS5wYWRkaW5nID0gXCIwXCI7XHJcblxyXG4gICAgZm9ybS5hcHBlbmRDaGlsZChkaXYpO1xyXG4gICAgZGl2LmFwcGVuZENoaWxkKHByb21wdCk7XHJcbiAgICBkaXYuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICByZXNpemUoKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgSFVEXHJcbiAgICAvLyBkaXNwbGF5IGFjdHVhbCBmcmFtZSByYXRlIHZzLiBtYXggZnJhbWUgcmF0ZVxyXG4gICAgLy8gZGlzcGxheSBmcmFtZSBjb3VudFxyXG4gICAgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGZvb3Rlci5zdHlsZS5jb2xvciA9IFwiIzAwYWEwMFwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLmJhY2tncm91bmQgPSBcIiMwMDBcIjtcclxuICAgIGZvb3Rlci5zdHlsZS5mb250U2l6ZSA9IFwiOHB4XCJcclxuICAgIGZvb3Rlci5zdHlsZS5wYWRkaW5nID0gXCIycHhcIjtcclxuICAgIGZvb3Rlci5zdHlsZS53aWR0aCA9IFwiNSVcIjtcclxuICAgIGZvb3Rlci5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcclxuICAgIGZvb3Rlci5zdHlsZS5ib3R0b20gPSBcIjBcIjtcclxuICAgIGZvb3Rlci5zdHlsZS5yaWdodCA9IFwiMFwiO1xyXG4gICAgZm9vdGVyLnN0eWxlLnRleHRBbGlnbiA9IFwicmlnaHRcIjtcclxuICAgIGZvb3Rlci5zdHlsZS53aGl0ZVNwYWNlID0gXCJub3dyYXBcIjtcclxuICAgIGZvb3Rlci5pbm5lclRleHQgPSBcInRlc3QgZm9vdGVyXCI7XHJcblxyXG4gICAgLy8gY3JlYXRlIG1pbmktbWFwXHJcbiAgICAvLyByZWZyZXNoIHJhdGUgZm9yIG1pbmktbWFwIHdpbGwgYmUgaW5kZXBlbmRlbnRseSBjb250cm9sbGVkXHJcblxyXG4gICAgLy8gZmFkZSBzb21lIHRleHQgaW5cclxuICAgIGxldCB0aXRsZVRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICB0aXRsZVRleHQuaW5uZXJUZXh0ID0gXCJuZWJ1bG91cyAvIGFjdHVhbFwiXHJcbiAgICB0aXRsZVRleHQuc3R5bGUuZm9udFNpemUgPSBcIjQ4cHRcIjtcclxuICAgIHRpdGxlVGV4dC5zdHlsZS5jb2xvciA9IFwiIzAwZmYwMFwiO1xyXG4gICAgdGl0bGVUZXh0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgdGl0bGVUZXh0LnN0eWxlLnRvcCA9IFwiMTUwcHhcIjsgLy8gY2VudGVyIHRoaXMgdmVydGljYWxseVxyXG4gICAgdGl0bGVUZXh0LnN0eWxlLmxlZnQgPSBcIjE1MHB4XCI7IC8vIGNlbnRlciB0aGlzIGhvcml6b250YWxseVxyXG4gICAgZWZmZWN0c1F1ZXVlLnB1c2goW25ldyBFZmZlY3QodGl0bGVUZXh0LCBFZmZlY3RFbnVtLmZhZGVJbiwgMTgwKSwgbmV3IEVmZmVjdCh0aXRsZVRleHQsIEVmZmVjdEVudW0uZmFkZU91dCwgMTgwKV0pO1xyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGl0bGVUZXh0KTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcblxyXG4gICAgLy8gc2Nyb2xsIHNvbWUgaW5pdCB0ZXh0IHdoZW4gcGFnZSBsb2Fkc1xyXG5cclxuICAgIHJ1bkxvb3AoKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJ1bkxvb3AoKVxyXG57XHJcbiAgICAvLyBkbyBzaGl0XHJcblxyXG4gICAgLy8gY2hlY2sgZHJhdyBxdWV1ZSAoc2hhcGVzLCBsaW5lcywgZ2x5cGhzLCBldGMuKVxyXG5cclxuICAgIC8vIHVwZGF0ZSBIVURcclxuICAgIC8vIHNldCByZWZyZXNoIHJhdGUgZm9yIEhVRCAtLSBkb2Vzbid0IG5lZWQgdG8gYmUgZXZlcnkgZnJhbWVcclxuICAgIGxldCB0aW1lU3RhbXBJbk1zID0gd2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgJiYgd2luZG93LnBlcmZvcm1hbmNlLnRpbWluZyAmJiB3aW5kb3cucGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydCA/IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSArIHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0IDogRGF0ZS5ub3coKTtcclxuICAgIGlmIChzdGFydFRpbWUgPT09IDApXHJcbiAgICB7XHJcbiAgICAgICAgc3RhcnRUaW1lID0gdGltZVN0YW1wSW5NcztcclxuICAgIH1cclxuICAgIGlmICgwID09PSBmcmFtZUNvdW50ICUgMzApXHJcbiAgICB7XHJcbiAgICAgICAgY3VycmVudEZwcyA9IE1hdGguZmxvb3IoMTAwMCAqIChmcmFtZUNvdW50IC0gbGFzdEZyYW1lQ291bnQpIC8gKHRpbWVTdGFtcEluTXMgLSBsYXN0RnJhbWVUaW1lKSk7XHJcbiAgICB9XHJcbiAgICAvL2Zvb3Rlci5pbm5lclRleHQgPSBgJHtmcmFtZUNvdW50fSAke01hdGguZmxvb3IodGltZVN0YW1wSW5NcyAtIHN0YXJ0VGltZSl9ICR7ZnBzfS8ke21heEZwc31gO1xyXG4gICAgZm9vdGVyLmlubmVyVGV4dCA9IGAke2xhc3RNb3VzZVh9ICR7bGFzdE1vdXNlWX0gJHtjdXJyZW50RnBzfS8ke21heEZwc31gO1xyXG4gICAgbGFzdEZyYW1lVGltZSA9IHRpbWVTdGFtcEluTXM7XHJcbiAgICBsYXN0RnJhbWVDb3VudCA9IGZyYW1lQ291bnQ7XHJcblxyXG4gICAgLy8gY2hlY2sgZWZmZWN0cyBxdWV1ZVxyXG4gICAgbGV0IG5ld1F1ZXVlOiBFZmZlY3RbXVtdID0gW107XHJcbiAgICBlZmZlY3RzUXVldWUuZm9yRWFjaChlZmZlY3RDaGFpbiA9PlxyXG4gICAge1xyXG4gICAgICAgIGxldCBlZmZlY3QgPSBlZmZlY3RDaGFpbi5zaGlmdCgpO1xyXG4gICAgICAgIGlmIChlZmZlY3QuYWR2YW5jZSgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZWZmZWN0Q2hhaW4udW5zaGlmdChlZmZlY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoMCA8IGVmZmVjdENoYWluLmxlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5ld1F1ZXVlLnB1c2goZWZmZWN0Q2hhaW4pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZWZmZWN0c1F1ZXVlID0gbmV3UXVldWU7XHJcbiAgICBzZXRUaW1lb3V0KHJ1bkxvb3AsIDEwMDAgLyBtYXhGcHMpO1xyXG4gICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIGZyYW1lQ291bnQrKztcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzaXplKClcclxue1xyXG4gICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSAyMDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAyNTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29udGV4dE1lbnUoKVxyXG57XHJcbiAgICAvLyBkcmF3IG15IG93biBjb250ZXh0IG1lbnUhXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1vdXNlTW92ZShtb3VzZUV2ZW50OiBNb3VzZUV2ZW50KVxyXG57XHJcbiAgICBsYXN0TW91c2VYID0gbW91c2VFdmVudC54O1xyXG4gICAgbGFzdE1vdXNlWSA9IG1vdXNlRXZlbnQueTtcclxufVxyXG5cclxuLy8gRG8gaXQuXHJcbndpbmRvdy5vbnJlc2l6ZSA9IHJlc2l6ZTtcclxud2luZG93Lm9uY29udGV4dG1lbnUgPSBjb250ZXh0TWVudTtcclxuc3RhcnQoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xpZW50L2luZGV4LnRzIiwiZXhwb3J0IGNsYXNzIEVmZmVjdFxyXG57XHJcbiAgICB0YXJnZXQ6IEhUTUxFbGVtZW50O1xyXG4gICAgZWZmZWN0OiBFZmZlY3RFbnVtO1xyXG4gICAgbGlmZU1heDogbnVtYmVyOyAvLyBpbml0aWFsIGxpZmVcclxuICAgIGxpZmVDdXJyZW50OiBudW1iZXI7IC8vIGN1cnJlbnQgdGltZSBsZWZ0XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0OiBIVE1MRWxlbWVudCwgZWZmZWN0OiBFZmZlY3RFbnVtLCBsaWZlTWF4OiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5lZmZlY3QgPSBlZmZlY3Q7XHJcbiAgICAgICAgdGhpcy5saWZlTWF4ID0gbGlmZU1heDtcclxuICAgICAgICB0aGlzLmxpZmVDdXJyZW50ID0gbGlmZU1heDtcclxuICAgIH1cclxuXHJcbiAgICBhZHZhbmNlKCk6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICBsZXQgb3BhY2l0eTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZWZmZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSBFZmZlY3RFbnVtLmJsaW5rOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRWZmZWN0RW51bS5mYWRlSW46XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gMSAtIHRoaXMubGlmZUN1cnJlbnQgLyB0aGlzLmxpZmVNYXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gYCR7b3BhY2l0eX1gO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRWZmZWN0RW51bS5mYWRlT3V0OlxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eSA9IHRoaXMubGlmZUN1cnJlbnQgLyB0aGlzLmxpZmVNYXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gYCR7b3BhY2l0eX1gO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gMCA8IHRoaXMubGlmZUN1cnJlbnQtLTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEVmZmVjdEVudW1cclxue1xyXG4gICAgYmxpbmssXHJcbiAgICBmYWRlSW4sXHJcbiAgICBmYWRlT3V0XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xpZW50L2VmZmVjdHMudHMiXSwic291cmNlUm9vdCI6IiJ9