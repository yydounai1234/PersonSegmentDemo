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

const videoElement = document.getElementById("process-video");
videoElement.width = 480;
videoElement.height = 320;
canvas1.width = videoElement.width;
canvas1.height = videoElement.height;
canvas2.width = videoElement.width;
canvas2.height = videoElement.height;

let bgImageData;


joinRoomBtn.addEventListener("click", joinRoom);

// 全局房间对象
const myRoom = new QNRTC.TrackModeSession();

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

	// 初始化背景数据
	const bgImg = document.getElementById("background-image");
	ctx1.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, 0, 0, canvas1.width, canvas2.height);
	bgImgData = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);

	// 启动 ai 处理
	perform(videoElement, canvas2, bgImageData);

	// 从处理结果中提取 track
	const stream = canvas2.captureStream();
	const qntrack = QNRTC.createCustomTrack(stream.getVideoTracks()[0]);

	const audioTracks = await QNRTC.deviceManager.getLocalTracks({ audio: { enabled: true } });

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
	myRoom.subscribe(trackInfoList.map(t => t.trackId)).then(tracks => {
		for (const track of tracks) {
			if (track.info.kind === "video") {
				track.play(remoteVideo);
			} else {
				track.play(trackContainer);
			}
		}
	});
}