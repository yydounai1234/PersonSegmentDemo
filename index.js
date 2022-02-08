// 获取一些页面上需要操作的 DOM 对象
const joinRoomBtn = document.getElementById("joinroom");
const roomTokenInput = document.getElementById("roomtoken");
const audioDeviceSelect = document.getElementById("audiodevice");
const videoDeviceSelect = document.getElementById("videodevice");
const localVideo = document.getElementById("localvideo");
const remoteVideo = document.getElementById("remotevideo");
const trackContainer = document.getElementById("trackcontainer");
const processContainer = document.getElementById("process-container");
const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');

const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');

const bgImg = document.getElementById("background-image")
let bgImgData;

// 播放本地摄像头流
let videoElement;

joinRoomBtn.addEventListener("click", joinRoom);

// 全局房间对象
const myRoom = new QNRTC.TrackModeSession();

// 如果此时枚举设备的操作完成，就更新页面设备列表
if (QNRTC.deviceManager.deviceInfo) {
    addDeviceToSelect(QNRTC.deviceManager.deviceInfo);
}
// 当检测到枚举完成或者设备列表更新的时候，更新页面设备列表
QNRTC.deviceManager.on("device-update", deviceInfo => {
    addDeviceToSelect(deviceInfo);
});

// 将枚举到的设备信息添加到页面上
function addDeviceToSelect(deviceInfo) {
    // 清空之前 select 下的元素，重新遍历添加
    while (audioDeviceSelect.firstChild) {
        audioDeviceSelect.removeChild(audioDeviceSelect.firstChild);
    }
    while (videoDeviceSelect.firstChild) {
        videoDeviceSelect.removeChild(videoDeviceSelect.firstChild);
    }

    // 遍历每个设备，添加到页面上供用户选择
    deviceInfo.forEach(info => {
        const optionElement = document.createElement("option");
        optionElement.value = info.deviceId;
        optionElement.text = info.label;
        if (info.kind === "audioinput") {
            audioDeviceSelect.appendChild(optionElement);
        } else if (info.kind === "videoinput") {
            videoDeviceSelect.appendChild(optionElement);
        }
    });
}

async function joinRoom() {
    // 从输入框中获取 roomToken
    const roomToken = roomTokenInput.value;
    try {
        // 加入房间
        const users = await myRoom.joinRoomWithToken(roomToken);
        // 因为我们假设是一对一连麦，如果加入后发现房间人数超过就退出报错
        // 实际上这里更好的做法是在 portal 上连麦应用中配置好房间人数上限
        // 这样就不要在前端做检查了
        if (users.length > 2) {
            myRoom.leaveRoom();
            alert("房间人数已满！");
            return;
        }

        // 订阅房间中已经存在的 tracks
        subscribeTracks(myRoom.trackInfoList);
    } catch (e) {
        console.error(e);
        alert(`加入房间失败！ErrorCode: ${e.code || ""}`);
        return;
    }

    // 监听房间中其他人发布的 Track，自动订阅它们
    myRoom.on("track-add", (tracks) => {
        subscribeTracks(tracks);
    });

    // 自动发布
    await publish();
}

async function publish() {
    let tracks;
    try {
        // 通过用户在页面上指定的设备发起采集
        // 也可以不指定设备，这样会由浏览器自动选择
        tracks = await QNRTC.deviceManager.getLocalTracks({
            video: {
                enabled: true, deviceId: videoDeviceSelect.value, bitrate: 1000, width: 320, height: 240,
            }, audio: {
                enabled: true, deviceId: audioDeviceSelect.value,
            },
        });
    } catch (e) {
        console.error(e);
        alert(`采集失败，请检查您的设备。ErrorCode: ${e.code}`);
        return;
    }

    // 播放采集到视频 Track
    for (const track of tracks) {
        if (track.info.kind === "video") {
            track.play(processContainer);
        }
    }

    // 拿到播放的 video 标签
    videoElement = processContainer.querySelector("video")
    videoElement.width = 320
    videoElement.height = 240
    canvas1.width = videoElement.width
    canvas1.height = videoElement.height
    canvas2.width = videoElement.width
    canvas2.height = videoElement.height

    // 初始化背景数据
    ctx1.drawImage(bgImg, 0, 0)
    bgImgData = ctx1.getImageData(0, 0, canvas1.width, canvas1.height)

    // 启动 ai 处理
    videoElement.onplaying = () => {
        loadBodyPix()
    }

    // 从处理结果中提取 track
    const stream = canvas2.captureStream()
    const qntrack = QNRTC.createCustomTrack(stream.getVideoTracks()[0])

    try {
        // 发布创建的新 track
        await myRoom.publish([qntrack]);
    } catch (e) {
        console.error(e);
        alert(`发布失败，ErrorCode: ${e.code}`);
    }
}

function subscribeTracks(trackInfoList) {
    // 批量订阅 tracks，并在页面上播放
    myRoom.subscribe(trackInfoList.map(t => t.trackId)).then(tracks => {
        for (const track of tracks) {
            if (track.info.kind === "video") {
                track.play(remoteVideo);
            } else {
                track.play(trackContainer);
            }
        }
    })
}

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

