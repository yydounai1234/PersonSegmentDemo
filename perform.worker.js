import * as tf from '@tensorflow/tfjs';
const webWorker = self;

let r1i, r2i, r3i, r4i, downsample_ratio, model;
let modelURL = "http://r3dg6y3l0.hd-bkt.clouddn.com/WebRTC/model/model.json";
/**
 * 初始化 tf
 */
const init = async (data) => {
  r1i = tf.tensor(0);
  r2i = tf.tensor(0);
  r3i = tf.tensor(0);
  r4i = tf.tensor(0);
  downsample_ratio = tf.tensor(data.config.downsample_ratio);
  // console.log("load model start");
  model = await tf.loadGraphModel(modelURL);
  // console.log("load model end");
  const first_frame = tf.zeros([data.height, data.width, 3]);
  const src = tf.tidy(() => first_frame.expandDims(0).div(255));
  const [fgr, pha, r1o, r2o, r3o, r4o] = await model.executeAsync(
    {
      src,
      r1i,
      r2i,
      r3i,
      r4i,
      downsample_ratio,
    },
    ["fgr", "pha", "r1o", "r2o", "r3o", "r4o"]
  );
  tf.dispose([first_frame, src, fgr, pha, r1i, r2i, r3i, r4i]);
  [r1i, r2i, r3i, r4i] = [r1o, r2o, r3o, r4o];
};

/**
 * 实时绘制
 */
const perform = async(imageData,bgImgData) => {
    await tf.nextFrame();
    const img = tf.browser.fromPixels(imageData)
    const src = tf.tidy(() => img.expandDims(0).div(255));
    const [fgr, pha, r1o, r2o, r3o, r4o] = await model.executeAsync(
        {
        src,
        r1i,
        r2i,
        r3i,
        r4i,
        downsample_ratio,
        },
        ["fgr", "pha", "r1o", "r2o", "r3o", "r4o"]
    );
    const data = drawMatte(fgr.clone(), pha.clone(), bgImgData);
    tf.dispose([img, src, fgr, pha, r1i, r2i, r3i, r4i]);
    [r1i, r2i, r3i, r4i] = [r1o, r2o, r3o, r4o];
    return data;
}

const drawMatte = async (fgr, pha, bgImgData) => {
    const rgba = tf.tidy(() => {
      const rgb =
        fgr !== null
          ? fgr.squeeze(0).mul(255).cast("int32")
          : tf.fill([pha.shape[1], pha.shape[2], 3], 255, "int32");
      const a =
        pha !== null
          ? pha.squeeze(0).mul(255).cast("int32")
          : tf.fill([fgr.shape[1], fgr.shape[2], 1], 255, "int32");
      return tf.concat([rgb, a], -1);
    });
    fgr && fgr.dispose();
    pha && pha.dispose();
    const [height, width] = rgba.shape.slice(0, 2);
    const pixelData = new Uint8ClampedArray(await rgba.data());
  
    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i + 3] <= 250) {
        pixelData[i] = bgImgData.data[i];
        pixelData[i + 1] = bgImgData.data[i + 1];
        pixelData[i + 2] = bgImgData.data[i + 2];
        pixelData[i + 3] = bgImgData.data[i + 3];
      }
    }
    const imageData = new ImageData(pixelData, width, height);
    rgba.dispose();
    return imageData;
  }

webWorker.addEventListener("message", async (event) => {
  const { action, data, id } = event.data;
  switch (action) {
    case "init":
      await init(data);
      webWorker.postMessage({ id });
      break;
    case "perform":
      const imageData = await perform(data.imageData,data.bgImgData);
      webWorker.postMessage({ id,data: imageData });
  }
});
