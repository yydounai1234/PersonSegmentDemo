# Person Segmentation Demo

A demo showing how to integrate [Qiniu RTC](https://developer.qiniu.com/rtc/8802/pd-overview) with [BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix).

## Steps

要点主要在采集和发布之间插入一个处理的流程，大概步骤如下：

1. 正常采集摄像头 Track
2. 播放摄像头 Track，拿到播放的 video 元素
3. 将 video 画到 canvas 中，从 canvas 中提取原始数据
4. 将 video 送入模型，获取输出掩码
5. 原始数据 + 掩码 + 背景图数据生成结果，画入第二个 canvas
6. 从第二个 canvas 中提取视频流，发布到七牛房间

## Core

核心代码如下：

注意，模型配置的参数可参考：https://github.com/tensorflow/tfjs-models/tree/master/body-pix

```js
let net;

function loadBodyPix() {
    let options = {
        architecture: 'MobileNetV1', multiplier: 0.75, stride: 16, quantBytes: 2
    }
    bodyPix.load(options)
        .then(n => {
            net = n
            perform()
        })
        .catch(err => console.log(err))
}

async function perform() {
    const segmentation = await net.segmentPerson(videoElement);

    //canvas-1上绘制视频流
    ctx1.drawImage(videoElement, 0, 0);
    const frame = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    const length = frame.data.length;
    const data = frame.data;
    const data_mask = segmentation.data;

    //根据person分割的mask图拿到视频流中person的前景画面
    for (let i = 0; i < length; i += 4) {
        let index = i / 4;
        // 空白处填入背景图数据
        if (data_mask[index] == 0) {
            data[i] = bgImgData.data[i]
            data[i+1] = bgImgData.data[i+1]
            data[i+2] = bgImgData.data[i+2]
            data[i+3] = bgImgData.data[i+3]
        }
    }

    //把上面的person前景画面绘制到带有背景图片的canvas-2上
    ctx2.putImageData(frame, 0, 0);
    requestAnimationFrame(perform)
}
```