/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./filter.worker.js":
/*!**************************!*\
  !*** ./filter.worker.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Worker_fn)\n/* harmony export */ });\nfunction Worker_fn() {\n  return new Worker(__webpack_require__.p + \"f3bd7d689d3e19fd9f1a.worker.js\");\n}\n\n\n//# sourceURL=webpack://personsegmentdemo/./filter.worker.js?");

/***/ }),

/***/ "./perform.worker.js":
/*!***************************!*\
  !*** ./perform.worker.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Worker_fn)\n/* harmony export */ });\nfunction Worker_fn() {\n  return new Worker(__webpack_require__.p + \"e8f4041f251c9dfe2587.worker.js\");\n}\n\n\n//# sourceURL=webpack://personsegmentdemo/./perform.worker.js?");

/***/ }),

/***/ "./perform-origin.js":
/*!***************************!*\
  !*** ./perform-origin.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"qnPersonSegmentModel\": () => (/* binding */ qnPersonSegmentModel)\n/* harmony export */ });\n/* harmony import */ var _perform_worker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./perform.worker.js */ \"./perform.worker.js\");\n/* harmony import */ var _filter_worker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter.worker.js */ \"./filter.worker.js\");\n\n\nconst webWorker = new _perform_worker_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nconst filterWorker = new _filter_worker_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\nclass QNPersonSegmentModel {\n  constructor() {\n    this.shouldStop = false;\n    this.videoElement = null;\n    this.messageTask = {};\n    this.filterTask = {};\n    this.rawCanvas = null;\n    this.rawCtx = null;\n    this.stream = null;\n    this.audioElement = null;\n    this.isDrawing = false;\n    webWorker.onmessage = (event) => {\n      const { id, data } = event.data;\n      if (this.messageTask[id]) {\n        this.messageTask[id].resolve(data);\n        delete this.messageTask[id];\n      }\n    };\n    filterWorker.onmessage = (event) => {\n      const { id, data } = event.data;\n      if (this.filterTask[id]) {\n        this.filterTask[id].resolve(data);\n        delete this.filterTask[id];\n      }\n    };\n  }\n\n  /**\n   * 发送 webWorker 消息\n   */\n  postMessage(action, data) {\n    const id = this.randomStringGen();\n    return new Promise((resolve, reject) => {\n      webWorker.postMessage({\n        action,\n        data,\n        id,\n      });\n      this.messageTask[id] = {\n        resolve,\n        reject,\n      };\n    });\n  }\n\n   /**\n   * 发送 webWorker 消息\n   */\n    postFilterMessage(action, data) {\n      const id = this.randomStringGen();\n      return new Promise((resolve, reject) => {\n        filterWorker.postMessage({\n          action,\n          data,\n          id,\n        });\n        this.filterTask[id] = {\n          resolve,\n          reject,\n        };\n      });\n    }\n\n\n  /**\n   * 转 16 进制\n   */\n  dec2hex(dec) {\n    return (\"0\" + dec.toString(16)).substr(-2);\n  }\n\n  /**\n   * 生成调用随机数\n   */\n  randomStringGen() {\n    const arr = new Uint8Array((16 || 0) / 2);\n    window.crypto.getRandomValues(arr);\n    return Array.from(arr, this.dec2hex).join(\"\");\n  }\n\n  /**\n   * 加载模型\n   */\n  async loadModel(videoElement, config = {\n    downsample_ratio: 0.5\n  }) {\n    this.videoElement = videoElement;\n    // return Promise.resolve()\n    return await this.postMessage(\"init\", {\n      height: videoElement.height,\n      width: videoElement.width,\n      config\n    });\n  }\n\n  /**\n   * 绘制 canvas 图片\n   */\n  async drawImageData(canvas, video, bgImgData) {\n    if (this.shouldStop) {\n      return false;\n    }\n    this.rawCtx.drawImage(\n      video,\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n    const imageData = this.rawCtx.getImageData(\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n    let t1 = new Date().getTime();\n    const result = await this.postMessage(\"perform\", { imageData, bgImgData });\n    let t2 = new Date().getTime();\n    console.log(`绘制花费:${t2 - t1}ms`);\n    const ctx = canvas.getContext(\"2d\");\n    ctx.drawImage(this.bgImgDataBitImgData, 0, 0)\n    const imgDataBitImgData = await createImageBitmap(result)\n    ctx.drawImage(imgDataBitImgData, 0, 0)\n    // ctx.putImageData(result, 0, 0);\n    // requestAnimationFrame(() => {\n    //   this.drawImageData(canvas, video, bgImgData);\n    // });\n  }\n\n  /**\n   * 绘制虚化图片\n   */\n  async drawBlurData(canvas, video, radius) {\n    if (this.shouldStop) {\n      return false;\n    }\n    this.rawCtx.drawImage(\n      video,\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n    const imageData = this.rawCtx.getImageData(\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n\n    let t1 = new Date().getTime();\n    const res = await Promise.all([this.postMessage(\"perform\", { imageData }), this.postFilterMessage(\"gaussBlur\", {imageData, radius})])\n    const [result, bgImgData] = res\n    let t2 = new Date().getTime();\n    console.log(`绘制花费:${t2 - t1}ms`);\n    const ctx = canvas.getContext(\"2d\");\n    const bgImgDataBitImgData = await createImageBitmap(bgImgData)\n    ctx.drawImage(bgImgDataBitImgData, 0, 0)\n    const imgDataBitImgData = await createImageBitmap(result)\n    ctx.drawImage(imgDataBitImgData, 0, 0)\n    // ctx.putImageData(result, 0, 0);\n    // requestAnimationFrame(() => {\n    //   this.drawImageData(canvas, video, bgImgData);\n    // });\n  }\n\n  async performBgImg(canvas, bgImgData, config = { video: true }) {\n    this.shouldStop = false;\n    this.bgImgDataBitImgData = await createImageBitmap(bgImgData)\n    this.rawCanvas = document.createElement(\"canvas\");\n    this.rawCanvas.height = canvas.height;\n    this.rawCanvas.width = canvas.width;\n    this.rawCtx = this.rawCanvas.getContext(\"2d\");\n    navigator.mediaDevices.getUserMedia(config).then(async (stream) => {\n      this.stream = stream;\n      this.videoElement.srcObject = stream;\n      while(this.shouldStop === false) {\n        await this.drawImageData(canvas, this.videoElement, bgImgData);\n      }\n    });\n  }\n\n  async performBlur(canvas, radius, config = { video: true }) {\n    this.shouldStop = false;\n    this.rawCanvas = document.createElement(\"canvas\");\n    this.rawCanvas.height = canvas.height;\n    this.rawCanvas.width = canvas.width;\n    this.rawCtx = this.rawCanvas.getContext(\"2d\");\n    navigator.mediaDevices.getUserMedia(config).then(async (stream) => {\n      this.stream = stream;\n      this.videoElement.srcObject = stream;\n      while(this.shouldStop === false) {\n        await this.drawBlurData(canvas, this.videoElement, radius);\n      }\n    });\n  }\n\n  stop() {\n    this.shouldStop = true;\n    if (this.stream) {\n      const tracks = this.stream.getTracks();\n      for (let i of tracks) {\n        i.stop();\n      }\n    }\n  }\n\n  /**\n   * 执行引擎\n   */\n  run() {\n    if(this.shouldStop) {\n      return false\n    }\n    setTimeout(() => {\n      \n      this.run()\n    },30)\n  }\n}\n\nconst qnPersonSegmentModel = new QNPersonSegmentModel();\n\n\n//# sourceURL=webpack://personsegmentdemo/./perform-origin.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./perform-origin.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});