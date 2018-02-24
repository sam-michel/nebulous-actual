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
/***/ (function(module, exports) {

var canvasContext;
function start() {
    // set body values
    document.body.style.backgroundColor = "#000000";
    document.body.style.cursor = "crosshair";
    document.body.style.font = "13px Helvetica, Arial";
    // create canvas
    let canvas = document.createElement("canvas");
    canvas.style.border = "2px solid #c3c3c3"; // sand: #fff2c4, forest: #206020
    canvas.style.backgroundColor = "black"; // sand: #fff2c4, forest: #206020
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
function resize() {
    return false;
}
function contextMenu() {
    return false;
}
// Do it.
window.onresize = resize;
window.oncontextmenu = contextMenu;
start();


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTllOTFhYjZiMGM0ZmFlNzI1NTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REEsSUFBSSxhQUFhLENBQUM7QUFFbEI7SUFFSSxrQkFBa0I7SUFDbEIsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztJQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO0lBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyx1QkFBdUIsQ0FBQztJQUVuRCxnQkFBZ0I7SUFDaEIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxDQUFFLGlDQUFpQztJQUM3RSxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsQ0FBRSxpQ0FBaUM7SUFDMUUsTUFBTSxDQUFDLFNBQVMsR0FBRyxtREFBbUQsQ0FBQztJQUN2RSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXZDLGFBQWE7SUFDYixnRUFBZ0U7SUFDaEUsd0RBQXdEO0lBQ3hELDJFQUEyRTtJQUMzRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztJQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7SUFFMUIsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUUzQixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hELFlBQVksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztJQUMxQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7SUFDaEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBTWpDLGFBQWE7SUFFYixrQkFBa0I7QUFFdEIsQ0FBQztBQUVEO0lBRUksTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBRUQ7SUFFSSxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTO0FBQ1QsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDekIsTUFBTSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7QUFDbkMsS0FBSyxFQUFFLENBQUMiLCJmaWxlIjoibmVidWxvdXMtYWN0dWFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTllOTFhYjZiMGM0ZmFlNzI1NTIiLCJ2YXIgY2FudmFzQ29udGV4dDtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0KClcclxue1xyXG4gICAgLy8gc2V0IGJvZHkgdmFsdWVzXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzAwMDAwMFwiO1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSBcImNyb3NzaGFpclwiO1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5mb250ID0gXCIxM3B4IEhlbHZldGljYSwgQXJpYWxcIjtcclxuXHJcbiAgICAvLyBjcmVhdGUgY2FudmFzXHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIGNhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjJweCBzb2xpZCAjYzNjM2MzXCI7ICAvLyBzYW5kOiAjZmZmMmM0LCBmb3Jlc3Q6ICMyMDYwMjBcclxuICAgIGNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7ICAvLyBzYW5kOiAjZmZmMmM0LCBmb3Jlc3Q6ICMyMDYwMjBcclxuICAgIGNhbnZhcy5pbm5lckhUTUwgPSBcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBjYW52YXMgZWxlbWVudC5cIjtcclxuICAgIGNhbnZhc0NvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgQ0xJXHJcbiAgICAvLyBhdCB0aGUgdmVyeSBsZWFzdCBJIG5lZWQgYW4gaW5wdXQgZmllbGQgYW5kIGEgY29tbWFuZCBoaXN0b3J5XHJcbiAgICAvLyBhbHNvIG5lZWQgRW50ZXIgdG9nZ2xlIGZvciBjb21tYW5kIGlucHV0IHZzIGZyZWUgdGV4dFxyXG4gICAgLy8gY3RybCArIEJhY2sgZGVsZXRlcyBhbGwgdGV4dCwgY3RybCArIHgvYy92IGN1dHMsIGNvcGllcywgYW5kIHBhc3RlcyB0ZXh0XHJcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xyXG4gICAgZm9ybS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjMDAwXCI7XHJcbiAgICBmb3JtLnN0eWxlLnBhZGRpbmcgPSBcIjNweFwiO1xyXG4gICAgZm9ybS5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcclxuICAgIGZvcm0uc3R5bGUuYm90dG9tID0gXCIwXCI7XHJcbiAgICBmb3JtLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcblxyXG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgaW5wdXQuYXV0b2NvbXBsZXRlID0gXCJvZmZcIjtcclxuXHJcbiAgICBsZXQgaW5wdXRIaXN0b3J5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgaW5wdXRIaXN0b3J5LnN0eWxlLmxpc3RTdHlsZVR5cGUgPSBcIm5vbmVcIjtcclxuICAgIGlucHV0SGlzdG9yeS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcclxuICAgIGlucHV0SGlzdG9yeS5zdHlsZS5wYWRkaW5nID0gXCIwXCI7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vIGNyZWF0ZSBIVURcclxuXHJcbiAgICAvLyBjcmVhdGUgbWluaS1tYXBcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZSgpXHJcbntcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gY29udGV4dE1lbnUoKVxyXG57XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vIERvIGl0LlxyXG53aW5kb3cub25yZXNpemUgPSByZXNpemU7XHJcbndpbmRvdy5vbmNvbnRleHRtZW51ID0gY29udGV4dE1lbnU7XHJcbnN0YXJ0KCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsaWVudC9pbmRleC50cyJdLCJzb3VyY2VSb290IjoiIn0=