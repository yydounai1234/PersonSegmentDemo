let t1;

function log(tag) {
	// const t2 = Date.now();
	// console.log("55555", tag, t2 - t1);
	// t1 = t2;
}
const webWorker = new Worker("./worker.js");

webWorker.onmessage = (event) => {
	console.log(event)
}


class QNPersonSegmentModel {

	constructor() {
		this.model;
		this.modelURL = 'http://r3dg6y3l0.hd-bkt.clouddn.com/WebRTC/model/model.json';
		this.r1i = tf.tensor(0.);
		this.r2i = tf.tensor(0.);
		this.r3i = tf.tensor(0.);
		this.r4i = tf.tensor(0.);
		this.downsample_ratio = tf.tensor(0.25);
		this.shouldStop = false;
		this.webcam = null;
		this.videoElement = null;
	}

	async loadModel(videoElement) {
		this.videoElement = videoElement
		t1 = Date.now();
		console.log("load model start");
		this.model = await tf.loadGraphModel(this.modelURL);
		console.log("load model end");
		//first frame process
		const first_frame = tf.zeros([videoElement.height, videoElement.width, 3]);
		const src = tf.tidy(() => first_frame.expandDims(0).div(255)); // normalize input
		const [fgr, pha, r1o, r2o, r3o, r4o] = await this.model.executeAsync(
			{ src, r1i: this.r1i, r2i: this.r2i, r3i: this.r3i, r4i: this.r4i, downsample_ratio: this.downsample_ratio }, // provide inputs
			["fgr", "pha", "r1o", "r2o", "r3o", "r4o"] // select outputs
		);
		// Dispose old tensors.
		tf.dispose([first_frame, src, fgr, pha, this.r1i, this.r2i, this.r3i, this.r4i]);
		// Update recurrent states.
		[this.r1i, this.r2i, this.r3i, this.r4i] = [r1o, r2o, r3o, r4o];
	}

	async perform(canvas, bgImgData, webcamConfig) {
		this.shouldStop = false;
		 navigator.mediaDevices.getUserMedia({
			video: true
		}).then((res) => {
			console.log(res, 111111111111)
		})
		this.webcam = await tf.data.webcam(this.videoElement, webcamConfig || {});
		log("webcam");

		const drawLoop = async () => {
			if (this.shouldStop) return;

			await tf.nextFrame();
			log("nextFrame");

			const img = await this.webcam.capture();
			log("capture");

			if (!img) return;

			const src = tf.tidy(() => img.expandDims(0).div(255)); // normalize input
			const [fgr, pha, r1o, r2o, r3o, r4o] = await this.model.executeAsync(
				{ src, r1i: this.r1i, r2i: this.r2i, r3i: this.r3i, r4i: this.r4i, downsample_ratio: this.downsample_ratio }, // provide inputs
				['fgr', 'pha', 'r1o', 'r2o', 'r3o', 'r4o']   // select outputs
			);
			log("execute");

			drawMatte(fgr.clone(), pha.clone(), canvas, bgImgData);
			log("drawMatte");

			// Dispose old tensors.
			tf.dispose([img, src, fgr, pha, this.r1i, this.r2i, this.r3i, this.r4i]);

			// Update recurrent states.
			[this.r1i, this.r2i, this.r3i, this.r4i] = [r1o, r2o, r3o, r4o];

			requestAnimationFrame(drawLoop);
		};

		drawLoop();
	}

	stop() {
		this.shouldStop = true;
		if (this.webcam) {
			this.webcam.stop();
		}
	}

}

const qnPersonSegmentModel = new QNPersonSegmentModel();


async function drawMatte(fgr, pha, canvas, bgImgData) {
	const rgba = tf.tidy(() => {
		const rgb = (fgr !== null) ?
			fgr.squeeze(0).mul(255).cast('int32') :
			tf.fill([pha.shape[1], pha.shape[2], 3], 255, 'int32');
		const a = (pha !== null) ?
			pha.squeeze(0).mul(255).cast('int32') :
			tf.fill([fgr.shape[1], fgr.shape[2], 1], 255, 'int32');
		return tf.concat([rgb, a], -1);
	});
	fgr && fgr.dispose();
	pha && pha.dispose();
	const [height, width] = rgba.shape.slice(0, 2);
	const pixelData = new Uint8ClampedArray(await rgba.data());

	for (let i = 0; i < pixelData.length; i += 4) {
		if (pixelData[i + 3] !== 255) {
			pixelData[i] = bgImgData.data[i];
			pixelData[i + 1] = bgImgData.data[i + 1];
			pixelData[i + 2] = bgImgData.data[i + 2];
			pixelData[i + 3] = bgImgData.data[i + 3];
		}
	}
	const imageData = new ImageData(pixelData, width, height);
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	ctx.putImageData(imageData, 0, 0);
	rgba.dispose();
}

