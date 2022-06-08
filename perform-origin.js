import Worker from './perform.worker.js';
// import FilterWorker from './filter.worker.js';
import * as StackBlur from './stackblur.js';
const webWorker = new Worker();
// const filterWorker = new FilterWorker();
class QNPersonSegmentModel {
  constructor() {
    this.shouldStop = false;
    this.videoElement = null;
    this.messageTask = {};
    this.filterTask = {};
    this.rawCanvas = null;
    this.rawCtx = null;
    this.stream = null;
    this.audioElement = null;
    this.isDrawing = false;
    webWorker.onmessage = (event) => {
      const { id, data } = event.data;
      if (this.messageTask[id]) {
        this.messageTask[id].resolve(data);
        delete this.messageTask[id];
      }
    };
    // filterWorker.onmessage = (event) => {
    //   const { id, data } = event.data;
    //   if (this.filterTask[id]) {
    //     this.filterTask[id].resolve(data);
    //     delete this.filterTask[id];
    //   }
    // };
  }

  /**
   * 发送 webWorker 消息
   */
  postMessage(action, data) {
    const id = this.randomStringGen();
    return new Promise((resolve, reject) => {
      webWorker.postMessage({
        action,
        data,
        id,
      });
      this.messageTask[id] = {
        resolve,
        reject,
      };
    });
  }

   /**
   * 发送 webWorker 消息
   */
    // postFilterMessage(action, data) {
    //   const id = this.randomStringGen();
    //   return new Promise((resolve, reject) => {
    //     filterWorker.postMessage({
    //       action,
    //       data,
    //       id,
    //     });
    //     this.filterTask[id] = {
    //       resolve,
    //       reject,
    //     };
    //   });
    // }


  /**
   * 转 16 进制
   */
  dec2hex(dec) {
    return ("0" + dec.toString(16)).substr(-2);
  }

  /**
   * 生成调用随机数
   */
  randomStringGen() {
    const arr = new Uint8Array((16 || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, this.dec2hex).join("");
  }

  /**
   * 加载模型
   */
  async loadModel(videoElement, config = {
    downsample_ratio: 0.5
  }) {
    this.videoElement = videoElement;
    // return Promise.resolve()
    return await this.postMessage("init", {
      height: videoElement.height,
      width: videoElement.width,
      config
    });
  }

  /**
   * 绘制 canvas 图片
   */
  async drawImageData(canvas, video) {
    if (this.shouldStop) {
      return false;
    }
    this.rawCtx.drawImage(
      video,
      0,
      0,
      this.rawCanvas.width,
      this.rawCanvas.height
    );
    const imageData = this.rawCtx.getImageData(
      0,
      0,
      this.rawCanvas.width,
      this.rawCanvas.height
    );
    let t1 = new Date().getTime();
    const result = await this.postMessage("perform", { imageData });
    const ctx = canvas.getContext("2d");
    ctx.drawImage(this.bgImgDataBitImgData, 0, 0)
    const imgDataBitImgData = await createImageBitmap(result)
    ctx.drawImage(imgDataBitImgData, 0, 0)
    let t2 = new Date().getTime();
    // console.log(`绘制花费:${t2 - t1}ms`);
    // ctx.putImageData(result, 0, 0);
    // requestAnimationFrame(() => {
    //   this.drawImageData(canvas, video, bgImgData);
    // });
  }

  /**
   * 绘制虚化图片
   */
  async drawBlurData(canvas, video, radius) {
    if (this.shouldStop) {
      return false;
    }
    this.rawCtx.drawImage(
      video,
      0,
      0,
      this.rawCanvas.width,
      this.rawCanvas.height
    );
    const imageData = this.rawCtx.getImageData(
      0,
      0,
      this.rawCanvas.width,
      this.rawCanvas.height
    );

    let t1 = new Date().getTime();
    const res = await Promise.all([this.postMessage("perform", { imageData }), this.blurBg(radius)])
    const [result, bgImgData] = res
    const ctx = canvas.getContext("2d");
    const bgImgDataBitImgData = await createImageBitmap(bgImgData)
    ctx.drawImage(bgImgDataBitImgData, 0, 0)
    const imgDataBitImgData = await createImageBitmap(result)
    ctx.drawImage(imgDataBitImgData, 0, 0)
    // ctx.putImageData(result, 0, 0);
    // requestAnimationFrame(() => {
    //   this.drawImageData(canvas, video, bgImgData);
    // });
    let t2 = new Date().getTime();
    // console.log(`绘制花费:${t2 - t1}ms`);
  }

  async blurBg(radius) {
    StackBlur.canvasRGBA(this.rawCanvas, 0, 0,  this.rawCanvas.width, this.rawCanvas.height, radius);
    const imageData = this.rawCtx.getImageData(
      0,
      0,
      this.rawCanvas.width,
      this.rawCanvas.height
    );
    return imageData
  }

  async performImg(canvas, bgImgData, config = { video: true }) {
    this.shouldStop = false;
    this.bgImgDataBitImgData = await createImageBitmap(bgImgData)
    this.rawCanvas = document.createElement("canvas");
    this.rawCanvas.height = canvas.height;
    this.rawCanvas.width = canvas.width;
    this.rawCtx = this.rawCanvas.getContext("2d");
    navigator.mediaDevices.getUserMedia(config).then(async (stream) => {
      this.stream = stream;
      this.videoElement.srcObject = stream;
      while(this.shouldStop === false) {
        await this.drawImageData(canvas, this.videoElement, bgImgData);
      }
    });
  }

  async performBlur(canvas, radius, config = { video: true }) {
    this.shouldStop = false;
    this.rawCanvas = document.createElement("canvas");
    this.rawCanvas.height = canvas.height;
    this.rawCanvas.width = canvas.width;
    this.rawCtx = this.rawCanvas.getContext("2d");
    navigator.mediaDevices.getUserMedia(config).then(async (stream) => {
      this.stream = stream;
      this.videoElement.srcObject = stream;
      while(this.shouldStop === false) {
        await this.drawBlurData(canvas, this.videoElement, radius);
      }
    });
  }

  stop() {
    this.shouldStop = true;
    if (this.stream) {
      const tracks = this.stream.getTracks();
      for (let i of tracks) {
        i.stop();
      }
    }
  }
}

export const qnPersonSegmentModel = new QNPersonSegmentModel();
