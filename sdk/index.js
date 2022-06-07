// 获取一些页面上需要操作的 DOM 对象
const joinRoomBtn = document.getElementById("joinroom");
const leaveRoomBtn = document.getElementById("leaveroom");
const roomTokenInput = document.getElementById("roomtoken");
const audioDeviceSelect = document.getElementById("audiodevice");
const videoDeviceSelect = document.getElementById("videodevice");
const localVideo = document.getElementById("localvideo");
const remoteVideo = document.getElementById("remotevideo");
const trackContainer = document.getElementById("trackcontainer");
const processContainer = document.getElementById("process-container");
const downsample_ratio = document.getElementById("downsample_ratio");
const loadModelBtn = document.getElementById("loadModel");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const videoElement = document.getElementById("video");
videoElement.width = 640;
videoElement.height = 400;
canvas.width = videoElement.width;
canvas.height = videoElement.height;

let bgImgData;

let audioTracks;

loadModelBtn.addEventListener("click", loadModel);
joinRoomBtn.addEventListener("click", joinRoom);

// 全局房间对象
const myRoom = new QNRTC.TrackModeSession();

async function loadModel() {
  loadModelBtn.disabled = true
  loadModelBtn.innerText = "model loading";
  qnPersonSegmentModel
    .loadModel(videoElement, {
        downsample_ratio: downsample_ratio.value * 1
    })
    .then(() => {
	  loadModelBtn.innerText = "model load success";
      joinRoomBtn.disabled = false;
      loadModelBtn.disabled = false;
    })
    .catch((e) => {
      console.log(e);
      loadModelBtn.innerText = "model load fail";
      loadModelBtn.disabled = false
    });
}

async function joinRoom() {
  // 从输入框中获取 roomToken
  const roomToken = roomTokenInput.value;
  // const roomToken = "QxZugR8TAhI38AiJ_cptTl3RbzLyca3t-AAiH-Hh:pjRfsN88wY3AILmNWKuZCp7mmfM=:eyJhcHBJZCI6ImcybTB5YTd3NyIsInJvb21OYW1lIjoiMjM0MjM0MjM0MjMiLCJ1c2VySWQiOiIyMzQyMzQyMyIsImV4cGlyZUF0IjoxNjQ5ODMxNjQ0ODMwNTM2NTE5LCJwZXJtaXNzaW9uIjoidXNlciJ9"

  try {
    // 加入房间
    const users = await myRoom.joinRoomWithToken(roomToken);
    // 因为我们假设是一对一连麦，如果加入后发现房间人数超过就退出报错
    // 实际上这里更好的做法是在 portal 上连麦应用中配置好房间人数上限
    // 这样就不要在前端做检查了
    // 初始化背景数据
    const bgImg = document.getElementById("background-image");
    ctx.drawImage(
      bgImg,
      0,
      0,
      bgImg.width,
      bgImg.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    bgImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 启动 ai 处理
    qnPersonSegmentModel.performBgImg(canvas, bgImgData);
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
  // 从处理结果中提取 track
  const stream = canvas.captureStream();
  const qntrack = QNRTC.createCustomTrack(stream.getVideoTracks()[0]);

  audioTracks = await QNRTC.deviceManager.getLocalTracks({
    audio: { enabled: true },
  });

  try {
    // 发布创建的新 track
    await myRoom.publish([...audioTracks, qntrack]);
  } catch (e) {
    console.error(e);
    alert(`发布失败，ErrorCode: ${e.code}`);
  }
}

function subscribeTracks(trackInfoList) {
  // 批量订阅 tracks，并在页面上播放
  myRoom.subscribe(trackInfoList.map((t) => t.trackId)).then((tracks) => {
    for (const track of tracks) {
      if (track.info.kind === "video") {
        track.play(remoteVideo);
      } else {
        track.play(trackContainer);
      }
    }
  });
}

leaveRoomBtn.onclick = () => {
  qnPersonSegmentModel.stop();
  audioTracks[0].release();
  myRoom.leaveRoom();
};
