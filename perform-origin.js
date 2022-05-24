import Worker from './perform.worker.js';
const webWorker = new Worker();
class QNPersonSegmentModel {
  constructor() {
    this.shouldStop = false;
    this.videoElement = null;
    this.messageTask = {};
    this.rawCanvas = null;
    this.rawCtx = null;
    this.stream = null;

    webWorker.onmessage = (event) => {
      const { id, data } = event.data;
      if (this.messageTask[id]) {
        this.messageTask[id].resolve(data);
        delete this.messageTask[id];
      }
    };
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
  async loadModel(videoElement) {
    this.videoElement = videoElement;
    // return Promise.resolve()
    return await this.postMessage("init", {
      height: videoElement.height,
      width: videoElement.width,
    });
  }

  /**
   * 绘制 canvas 图片
   */
  async drawImageData(canvas, video, bgImgData) {
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
    const result = await this.postMessage("perform", { imageData, bgImgData });
    let t2 = new Date().getTime();
    // console.log(`绘制花费:${t2 - t1}ms`);
    const ctx = canvas.getContext("2d");
	const imageBitmap = await createImageBitmap(result)
    ctx.drawImage(imageBitmap, 0, 0);
    requestAnimationFrame(() => {
      this.drawImageData(canvas, video, bgImgData);
    });
  }

  async perform(canvas, bgImgData, config = { video: true }) {
    this.shouldStop = false;
    this.rawCanvas = document.createElement("canvas");
    this.rawCanvas.height = canvas.height;
    this.rawCanvas.width = canvas.width;
    this.rawCtx = this.rawCanvas.getContext("2d");
    navigator.mediaDevices.getUserMedia(config).then((stream) => {
      this.stream = stream;
      this.videoElement.srcObject = stream;
      requestAnimationFrame(() => {
        this.drawImageData(canvas, this.videoElement, bgImgData);
      });
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
