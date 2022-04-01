async function perform(videoElement, canvas, bgImgData, webcamConfig) {
	console.log("start perform", videoElement, canvas, bgImgData, webcamConfig);
	const webcam = await tf.data.webcam(videoElement, webcamConfig || {});
	const modelUrl = 'http://r3dg6y3l0.hd-bkt.clouddn.com/WebRTC/model/model.json';
	const model = await tf.loadGraphModel(modelUrl);

	// Set initial recurrent state
	let [r1i, r2i, r3i, r4i] = [tf.tensor(0.), tf.tensor(0.), tf.tensor(0.), tf.tensor(0.)];

	// Set downsample ratio
	const downsample_ratio = tf.tensor(0.5);

	const drawLoop = async () => {
		console.log(22222, webcam)
		await tf.nextFrame();
		const img = await webcam.capture();
		const src = tf.tidy(() => img.expandDims(0).div(255)); // normalize input
		const [fgr, pha, r1o, r2o, r3o, r4o] = await model.executeAsync(
			{ src, r1i, r2i, r3i, r4i, downsample_ratio }, // provide inputs
			['fgr', 'pha', 'r1o', 'r2o', 'r3o', 'r4o']   // select outputs
		);
	
		drawMatte(fgr.clone(), pha.clone(), canvas, bgImgData);
	
		// Dispose old tensors.
		tf.dispose([img, src, fgr, pha, r1i, r2i, r3i, r4i]);
	
		// Update recurrent states.
		[r1i, r2i, r3i, r4i] = [r1o, r2o, r3o, r4o];
	
		requestAnimationFrame(drawLoop)
	}

	drawLoop()

}


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
