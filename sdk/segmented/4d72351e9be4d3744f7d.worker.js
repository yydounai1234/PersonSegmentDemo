/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./filter.worker.js":
/*!**************************!*\
  !*** ./filter.worker.js ***!
  \**************************/
/***/ (() => {

eval("/**\n * 此函数为分别循环\n */\nasync function gaussBlur1(imgData, radius, sigma) {\n  var pixes = imgData.data;\n  var width = imgData.width;\n  var height = imgData.height;\n  var gaussMatrix = [],\n    gaussSum = 0,\n    x,\n    y,\n    r,\n    g,\n    b,\n    a,\n    i,\n    j,\n    k,\n    len;\n\n  radius = Math.floor(radius) || 3;\n  sigma = sigma || radius / 3;\n\n  a = 1 / (Math.sqrt(2 * Math.PI) * sigma);\n  b = -1 / (2 * sigma * sigma);\n  //生成高斯矩阵\n  for (i = 0, x = -radius; x <= radius; x++, i++) {\n    g = a * Math.exp(b * x * x);\n    gaussMatrix[i] = g;\n    gaussSum += g;\n  }\n  //归一化, 保证高斯矩阵的值在[0,1]之间\n  for (i = 0, len = gaussMatrix.length; i < len; i++) {\n    gaussMatrix[i] /= gaussSum;\n  }\n  //x 方向一维高斯运算\n  for (y = 0; y < height; y++) {\n    for (x = 0; x < width; x++) {\n      r = g = b = a = 0;\n      gaussSum = 0;\n      for (j = -radius; j <= radius; j++) {\n        k = x + j;\n        if (k >= 0 && k < width) {\n          //确保 k 没超出 x 的范围\n          //r,g,b,a 四个一组\n          i = (y * width + k) * 4;\n          r += pixes[i] * gaussMatrix[j + radius];\n          g += pixes[i + 1] * gaussMatrix[j + radius];\n          b += pixes[i + 2] * gaussMatrix[j + radius];\n          // a += pixes[i + 3] * gaussMatrix[j];\n          gaussSum += gaussMatrix[j + radius];\n        }\n      }\n      i = (y * width + x) * 4;\n      // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题\n      // console.log(gaussSum)\n      pixes[i] = r / gaussSum;\n      pixes[i + 1] = g / gaussSum;\n      pixes[i + 2] = b / gaussSum;\n      // pixes[i + 3] = a ;\n    }\n  }\n  //y 方向一维高斯运算\n  for (x = 0; x < width; x++) {\n    for (y = 0; y < height; y++) {\n      r = g = b = a = 0;\n      gaussSum = 0;\n      for (j = -radius; j <= radius; j++) {\n        k = y + j;\n        if (k >= 0 && k < height) {\n          //确保 k 没超出 y 的范围\n          i = (k * width + x) * 4;\n          r += pixes[i] * gaussMatrix[j + radius];\n          g += pixes[i + 1] * gaussMatrix[j + radius];\n          b += pixes[i + 2] * gaussMatrix[j + radius];\n          // a += pixes[i + 3] * gaussMatrix[j];\n          gaussSum += gaussMatrix[j + radius];\n        }\n      }\n      i = (y * width + x) * 4;\n      pixes[i] = r / gaussSum;\n      pixes[i + 1] = g / gaussSum;\n      pixes[i + 2] = b / gaussSum;\n      // pixes[i] = r ;\n      // pixes[i + 1] = g ;\n      // pixes[i + 2] = b ;\n      // pixes[i + 3] = a ;\n    }\n  }\n  // //end\n  // imgData.data = pixes;\n  // return imgData;\n  return new ImageData(pixes, width, height);\n}\n\n\nwebWorker.addEventListener(\"message\", async (event) => {\n  const { action, data, id } = event.data;\n  switch (action) {\n    case \"gaussBlur\":\n      const imageData = await gaussBlur(data.imageData, data.radius);\n      webWorker.postMessage({ id,data: imageData });\n  }\n});\n\n//# sourceURL=webpack://personsegmentdemo/./filter.worker.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./filter.worker.js"]();
/******/ 	
/******/ })()
;