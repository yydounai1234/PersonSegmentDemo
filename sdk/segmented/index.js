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

/***/ "./perform.worker.js":
/*!***************************!*\
  !*** ./perform.worker.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Worker_fn)\n/* harmony export */ });\nfunction Worker_fn() {\n  return new Worker(__webpack_require__.p + \"index.worker.js\");\n}\n\n\n//# sourceURL=webpack://personsegmentdemo/./perform.worker.js?");

/***/ }),

/***/ "./perform-filter.js":
/*!***************************!*\
  !*** ./perform-filter.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"gaussBlur\": () => (/* binding */ gaussBlur),\n/* harmony export */   \"gaussBlur1\": () => (/* binding */ gaussBlur1)\n/* harmony export */ });\n/**\n * 此函数为二重循环\n */\nfunction gaussBlur(imgData, radius, sigma) {\n  var pixes = imgData.data,\n    width = imgData.width,\n    height = imgData.height;\n\n  radius = radius || 5;\n  sigma = sigma || radius / 3;\n\n  var gaussEdge = radius * 2 + 1; // 高斯矩阵的边长\n\n  var gaussMatrix = [],\n    gaussSum = 0,\n    a = 1 / (2 * sigma * sigma * Math.PI),\n    b = -a * Math.PI;\n\n  for (var i = -radius; i <= radius; i++) {\n    for (var j = -radius; j <= radius; j++) {\n      var gxy = a * Math.exp((i * i + j * j) * b);\n      gaussMatrix.push(gxy);\n      gaussSum += gxy; // 得到高斯矩阵的和，用来归一化\n    }\n  }\n  var gaussNum = (radius + 1) * (radius + 1);\n  for (var i = 0; i < gaussNum; i++) {\n    gaussMatrix[i] = gaussMatrix[i] / gaussSum; // 除gaussSum是归一化\n  }\n\n  //console.log(gaussMatrix);\n\n  // 循环计算整个图像每个像素高斯处理之后的值\n  for (var x = 0; x < width; x++) {\n    for (var y = 0; y < height; y++) {\n      var r = 0,\n        g = 0,\n        b = 0;\n\n      //console.log(1);\n\n      // 计算每个点的高斯处理之后的值\n      for (var i = -radius; i <= radius; i++) {\n        // 处理边缘\n        var m = handleEdge(i, x, width);\n        for (var j = -radius; j <= radius; j++) {\n          // 处理边缘\n          var mm = handleEdge(j, y, height);\n\n          var currentPixId = (mm * width + m) * 4;\n\n          var jj = j + radius;\n          var ii = i + radius;\n          r += pixes[currentPixId] * gaussMatrix[jj * gaussEdge + ii];\n          g += pixes[currentPixId + 1] * gaussMatrix[jj * gaussEdge + ii];\n          b += pixes[currentPixId + 2] * gaussMatrix[jj * gaussEdge + ii];\n        }\n      }\n      var pixId = (y * width + x) * 4;\n\n      pixes[pixId] = ~~r;\n      pixes[pixId + 1] = ~~g;\n      pixes[pixId + 2] = ~~b;\n    }\n  }\n  // imgData.data = pixes;\n  return new ImageData(pixes, width, height);\n}\n\nfunction handleEdge(i, x, w) {\n  var m = x + i;\n  if (m < 0) {\n    m = -m;\n  } else if (m >= w) {\n    m = w + i - x;\n  }\n  return m;\n}\n\n/**\n * 此函数为分别循环\n */\nasync function gaussBlur1(imgData, radius, sigma) {\n  var pixes = imgData.data;\n  var width = imgData.width;\n  var height = imgData.height;\n  var gaussMatrix = [],\n    gaussSum = 0,\n    x,\n    y,\n    r,\n    g,\n    b,\n    a,\n    i,\n    j,\n    k,\n    len;\n\n  radius = Math.floor(radius) || 3;\n  sigma = sigma || radius / 3;\n\n  a = 1 / (Math.sqrt(2 * Math.PI) * sigma);\n  b = -1 / (2 * sigma * sigma);\n  //生成高斯矩阵\n  for (i = 0, x = -radius; x <= radius; x++, i++) {\n    g = a * Math.exp(b * x * x);\n    gaussMatrix[i] = g;\n    gaussSum += g;\n  }\n  //归一化, 保证高斯矩阵的值在[0,1]之间\n  for (i = 0, len = gaussMatrix.length; i < len; i++) {\n    gaussMatrix[i] /= gaussSum;\n  }\n  //x 方向一维高斯运算\n  for (y = 0; y < height; y++) {\n    for (x = 0; x < width; x++) {\n      r = g = b = a = 0;\n      gaussSum = 0;\n      for (j = -radius; j <= radius; j++) {\n        k = x + j;\n        if (k >= 0 && k < width) {\n          //确保 k 没超出 x 的范围\n          //r,g,b,a 四个一组\n          i = (y * width + k) * 4;\n          r += pixes[i] * gaussMatrix[j + radius];\n          g += pixes[i + 1] * gaussMatrix[j + radius];\n          b += pixes[i + 2] * gaussMatrix[j + radius];\n          // a += pixes[i + 3] * gaussMatrix[j];\n          gaussSum += gaussMatrix[j + radius];\n        }\n      }\n      i = (y * width + x) * 4;\n      // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题\n      // console.log(gaussSum)\n      pixes[i] = r / gaussSum;\n      pixes[i + 1] = g / gaussSum;\n      pixes[i + 2] = b / gaussSum;\n      // pixes[i + 3] = a ;\n    }\n  }\n  //y 方向一维高斯运算\n  for (x = 0; x < width; x++) {\n    for (y = 0; y < height; y++) {\n      r = g = b = a = 0;\n      gaussSum = 0;\n      for (j = -radius; j <= radius; j++) {\n        k = y + j;\n        if (k >= 0 && k < height) {\n          //确保 k 没超出 y 的范围\n          i = (k * width + x) * 4;\n          r += pixes[i] * gaussMatrix[j + radius];\n          g += pixes[i + 1] * gaussMatrix[j + radius];\n          b += pixes[i + 2] * gaussMatrix[j + radius];\n          // a += pixes[i + 3] * gaussMatrix[j];\n          gaussSum += gaussMatrix[j + radius];\n        }\n      }\n      i = (y * width + x) * 4;\n      pixes[i] = r / gaussSum;\n      pixes[i + 1] = g / gaussSum;\n      pixes[i + 2] = b / gaussSum;\n      // pixes[i] = r ;\n      // pixes[i + 1] = g ;\n      // pixes[i + 2] = b ;\n      // pixes[i + 3] = a ;\n    }\n  }\n  // //end\n  // imgData.data = pixes;\n  // return imgData;\n  return new ImageData(pixes, width, height);\n}\n\n\n//# sourceURL=webpack://personsegmentdemo/./perform-filter.js?");

/***/ }),

/***/ "./perform-origin.js":
/*!***************************!*\
  !*** ./perform-origin.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"qnPersonSegmentModel\": () => (/* binding */ qnPersonSegmentModel)\n/* harmony export */ });\n/* harmony import */ var _perform_worker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./perform.worker.js */ \"./perform.worker.js\");\n/* harmony import */ var _perform_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./perform-filter */ \"./perform-filter.js\");\n\n\nconst webWorker = new _perform_worker_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nclass QNPersonSegmentModel {\n  constructor() {\n    this.shouldStop = false;\n    this.videoElement = null;\n    this.messageTask = {};\n    this.rawCanvas = null;\n    this.rawCtx = null;\n    this.stream = null;\n    this.audioElement = null;\n    this.isDrawing = false;\n    webWorker.onmessage = (event) => {\n      const { id, data } = event.data;\n      if (this.messageTask[id]) {\n        this.messageTask[id].resolve(data);\n        delete this.messageTask[id];\n      }\n    };\n  }\n\n  /**\n   * 发送 webWorker 消息\n   */\n  postMessage(action, data) {\n    const id = this.randomStringGen();\n    return new Promise((resolve, reject) => {\n      webWorker.postMessage({\n        action,\n        data,\n        id,\n      });\n      this.messageTask[id] = {\n        resolve,\n        reject,\n      };\n    });\n  }\n\n  /**\n   * 转 16 进制\n   */\n  dec2hex(dec) {\n    return (\"0\" + dec.toString(16)).substr(-2);\n  }\n\n  /**\n   * 生成调用随机数\n   */\n  randomStringGen() {\n    const arr = new Uint8Array((16 || 0) / 2);\n    window.crypto.getRandomValues(arr);\n    return Array.from(arr, this.dec2hex).join(\"\");\n  }\n\n  /**\n   * 加载模型\n   */\n  async loadModel(videoElement, config = {\n    downsample_ratio: 0.5\n  }) {\n    this.videoElement = videoElement;\n    // return Promise.resolve()\n    return await this.postMessage(\"init\", {\n      height: videoElement.height,\n      width: videoElement.width,\n      config\n    });\n  }\n\n  /**\n   * 绘制 canvas 图片\n   */\n  async drawImageData(canvas, video, bgImgData) {\n    if (this.shouldStop) {\n      return false;\n    }\n    this.rawCtx.drawImage(\n      video,\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n    const imageData = this.rawCtx.getImageData(\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n    let t1 = new Date().getTime();\n    const result = await this.postMessage(\"perform\", { imageData, bgImgData });\n    let t2 = new Date().getTime();\n    // console.log(`绘制花费:${t2 - t1}ms`);\n    const ctx = canvas.getContext(\"2d\");\n    const bgImgDataBitImgData = await createImageBitmap(bgImgData)\n    ctx.drawImage(bgImgDataBitImgData, 0, 0)\n    const imgDataBitImgData = await createImageBitmap(result)\n    ctx.drawImage(imgDataBitImgData, 0, 0)\n    // ctx.putImageData(result, 0, 0);\n    // requestAnimationFrame(() => {\n    //   this.drawImageData(canvas, video, bgImgData);\n    // });\n  }\n\n  async drawBlurData(canvas, video, radius) {\n    if (this.shouldStop) {\n      return false;\n    }\n    this.rawCtx.drawImage(\n      video,\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n    const imageData = this.rawCtx.getImageData(\n      0,\n      0,\n      this.rawCanvas.width,\n      this.rawCanvas.height\n    );\n\n    let t1 = new Date().getTime();\n    const res = await Promise.all([this.postMessage(\"perform\", { imageData }), (0,_perform_filter__WEBPACK_IMPORTED_MODULE_1__.gaussBlur1)(imageData, radius)])\n    console.log(res, \"=======================\")\n    const [result, bgImgData] = res\n    let t2 = new Date().getTime();\n    console.log(`绘制花费:${t2 - t1}ms`);\n    const ctx = canvas.getContext(\"2d\");\n    const bgImgDataBitImgData = await createImageBitmap(bgImgData)\n    ctx.drawImage(bgImgDataBitImgData, 0, 0)\n    const imgDataBitImgData = await createImageBitmap(result)\n    ctx.drawImage(imgDataBitImgData, 0, 0)\n    // ctx.putImageData(result, 0, 0);\n    // requestAnimationFrame(() => {\n    //   this.drawImageData(canvas, video, bgImgData);\n    // });\n  }\n\n  async performBgImg(canvas, bgImgData, config = { video: true }) {\n    this.shouldStop = false;\n    this.rawCanvas = document.createElement(\"canvas\");\n    this.rawCanvas.height = canvas.height;\n    this.rawCanvas.width = canvas.width;\n    this.rawCtx = this.rawCanvas.getContext(\"2d\");\n    navigator.mediaDevices.getUserMedia(config).then(async (stream) => {\n      this.stream = stream;\n      this.videoElement.srcObject = stream;\n      while(this.shouldStop === false) {\n        await this.drawImageData(canvas, this.videoElement, bgImgData);\n      }\n    });\n  }\n\n  async performBlur(canvas, radius, config = { video: true }) {\n    this.shouldStop = false;\n    this.rawCanvas = document.createElement(\"canvas\");\n    this.rawCanvas.height = canvas.height;\n    this.rawCanvas.width = canvas.width;\n    this.rawCtx = this.rawCanvas.getContext(\"2d\");\n    navigator.mediaDevices.getUserMedia(config).then(async (stream) => {\n      this.stream = stream;\n      this.videoElement.srcObject = stream;\n      while(this.shouldStop === false) {\n        await this.drawBlurData(canvas, this.videoElement, radius);\n      }\n    });\n  }\n\n  stop() {\n    this.shouldStop = true;\n    if (this.stream) {\n      const tracks = this.stream.getTracks();\n      for (let i of tracks) {\n        i.stop();\n      }\n    }\n  }\n}\n\nconst qnPersonSegmentModel = new QNPersonSegmentModel();\n\n\n//# sourceURL=webpack://personsegmentdemo/./perform-origin.js?");

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