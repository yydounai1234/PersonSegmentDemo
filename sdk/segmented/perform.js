const a0_0x1f01df = a0_0x5e3b;
function a0_0x1e12() {
  const _0x4c7d67 = [
    "join",
    "getTracks",
    "randomStringGen",
    "stream",
    "shouldStop",
    "videoElement",
    "canvas",
    "messageTask",
    "width",
    "486134XdSLwA",
    "createElement",
    "dec2hex",
    "rawCanvas",
    "261TZsjoe",
    "9067860jZCwhm",
    "stop",
    "substr",
    "loadModel",
    "getContext",
    "4953151pZtvjg",
    "110744TEAlZs",
    "rawCtx",
    "onmessage",
    "getTime",
    "3991479yxVPDX",
    "6867930AzLdEb",
    "postMessage",
    "3124316jzjqZZ",
    "perform",
    "height",
    "mediaDevices",
    "2HXpQhn",
    "drawImageData",
    "then",
    "5rrsZIJ",
  ];
  a0_0x1e12 = function () {
    return _0x4c7d67;
  };
  return a0_0x1e12();
}
(function (_0x468fe8, _0x3d9199) {
  const _0x368bc8 = a0_0x5e3b,
    _0x2d8cca = _0x468fe8();
  while (!![]) {
    try {
      const _0x8540b1 =
        (-parseInt(_0x368bc8(0x92)) / 0x1) * (parseInt(_0x368bc8(0x85)) / 0x2) +
        parseInt(_0x368bc8(0xa1)) / 0x3 +
        (-parseInt(_0x368bc8(0x81)) / 0x4) *
          (-parseInt(_0x368bc8(0x88)) / 0x5) +
        parseInt(_0x368bc8(0xa2)) / 0x6 +
        -parseInt(_0x368bc8(0x9c)) / 0x7 +
        (-parseInt(_0x368bc8(0x9d)) / 0x8) * (parseInt(_0x368bc8(0x96)) / 0x9) +
        -parseInt(_0x368bc8(0x97)) / 0xa;
      if (_0x8540b1 === _0x3d9199) break;
      else _0x2d8cca["push"](_0x2d8cca["shift"]());
    } catch (_0x3cbc63) {
      _0x2d8cca["push"](_0x2d8cca["shift"]());
    }
  }
})(a0_0x1e12, 0xb825b);
function a0_0x5e3b(_0x23e137, _0x3cb145) {
  const _0x1e12f7 = a0_0x1e12();
  return (
    (a0_0x5e3b = function (_0x5e3b6a, _0x58cbd3) {
      _0x5e3b6a = _0x5e3b6a - 0x80;
      let _0x6aa87b = _0x1e12f7[_0x5e3b6a];
      return _0x6aa87b;
    }),
    a0_0x5e3b(_0x23e137, _0x3cb145)
  );
}
const webWorker = new Worker("./worker.js");
class QNPersonSegmentModel {
  constructor() {
    const _0x51544b = a0_0x5e3b;
    (this["shouldStop"] = ![]),
      (this[_0x51544b(0x8e)] = null),
      (this["messageTask"] = {}),
      (this[_0x51544b(0x95)] = null),
      (this["rawCtx"] = null),
      (this[_0x51544b(0x8c)] = null),
      (webWorker[_0x51544b(0x9f)] = (_0x4d02ea) => {
        const _0x2f452f = _0x51544b,
          { id: _0x773d08, data: _0x3c016a } = _0x4d02ea["data"];
        this["messageTask"][_0x773d08] &&
          (this[_0x2f452f(0x90)][_0x773d08]["resolve"](_0x3c016a),
          delete this[_0x2f452f(0x90)][_0x773d08]);
      });
  }
  [a0_0x1f01df(0x80)](_0x52b802, _0x1fb13f) {
    const _0x5324bc = a0_0x1f01df,
      _0xbfaf2c = this[_0x5324bc(0x8b)]();
    return new Promise((_0xafca3d, _0x2d4d2e) => {
      webWorker["postMessage"]({
        action: _0x52b802,
        data: _0x1fb13f,
        id: _0xbfaf2c,
      }),
        (this["messageTask"][_0xbfaf2c] = {
          resolve: _0xafca3d,
          reject: _0x2d4d2e,
        });
    });
  }
  [a0_0x1f01df(0x94)](_0x5e6883) {
    const _0x274443 = a0_0x1f01df;
    return ("0" + _0x5e6883["toString"](0x10))[_0x274443(0x99)](-0x2);
  }
  ["randomStringGen"]() {
    const _0xbafb03 = a0_0x1f01df,
      _0x2284ed = new Uint8Array((0x10 || 0x28) / 0x2);
    return (
      window["crypto"]["getRandomValues"](_0x2284ed),
      Array["from"](_0x2284ed, this[_0xbafb03(0x94)])[_0xbafb03(0x89)]("")
    );
  }
  async [a0_0x1f01df(0x9a)](_0x28f650) {
    const _0x50f573 = a0_0x1f01df;
    return (
      (this[_0x50f573(0x8e)] = _0x28f650),
      await this[_0x50f573(0x80)]("init", {
        height: _0x28f650[_0x50f573(0x83)],
        width: _0x28f650[_0x50f573(0x91)],
      })
    );
  }
  async [a0_0x1f01df(0x86)](_0x3c4605, _0x3847bd, _0x322ec7) {
    const _0x251beb = a0_0x1f01df;
    if (this[_0x251beb(0x8d)]) return ![];
    this[_0x251beb(0x9e)]["drawImage"](
      _0x3847bd,
      0x0,
      0x0,
      this["rawCanvas"][_0x251beb(0x91)],
      this[_0x251beb(0x95)][_0x251beb(0x83)]
    );
    const _0xee67af = this["rawCtx"]["getImageData"](
      0x0,
      0x0,
      this[_0x251beb(0x95)]["width"],
      this[_0x251beb(0x95)][_0x251beb(0x83)]
    );
    let _0x37f299 = new Date()[_0x251beb(0xa0)]();
    const _0xaf92dd = await this[_0x251beb(0x80)]("perform", {
      imageData: _0xee67af,
      bgImgData: _0x322ec7,
    });
    let _0x504823 = new Date()["getTime"]();
    const _0x5a40f2 = _0x3c4605["getContext"]("2d"),
      _0x4f2035 = await createImageBitmap(_0xaf92dd);
    _0x5a40f2["drawImage"](_0x4f2035, 0x0, 0x0),
      requestAnimationFrame(() => {
        const _0x50388a = _0x251beb;
        this[_0x50388a(0x86)](_0x3c4605, _0x3847bd, _0x322ec7);
      });
  }
  async [a0_0x1f01df(0x82)](_0x1fb2eb, _0x452c9b, _0x2a7a6a = { video: !![] }) {
    const _0x573e42 = a0_0x1f01df;
    (this[_0x573e42(0x8d)] = ![]),
      (this[_0x573e42(0x95)] = document[_0x573e42(0x93)](_0x573e42(0x8f))),
      (this[_0x573e42(0x95)][_0x573e42(0x83)] = _0x1fb2eb["height"]),
      (this[_0x573e42(0x95)][_0x573e42(0x91)] = _0x1fb2eb["width"]),
      (this[_0x573e42(0x9e)] = this[_0x573e42(0x95)][_0x573e42(0x9b)]("2d")),
      navigator[_0x573e42(0x84)]
        ["getUserMedia"](_0x2a7a6a)
        [_0x573e42(0x87)]((_0x38e56c) => {
          (this["stream"] = _0x38e56c),
            (this["videoElement"]["srcObject"] = _0x38e56c),
            requestAnimationFrame(() => {
              const _0xfee3d2 = a0_0x5e3b;
              this[_0xfee3d2(0x86)](_0x1fb2eb, this["videoElement"], _0x452c9b);
            });
        });
  }
  [a0_0x1f01df(0x98)]() {
    const _0x28dac4 = a0_0x1f01df;
    this["shouldStop"] = !![];
    if (this[_0x28dac4(0x8c)]) {
      const _0x376f27 = this[_0x28dac4(0x8c)][_0x28dac4(0x8a)]();
      for (let _0x19fd37 of _0x376f27) {
        _0x19fd37["stop"]();
      }
    }
  }
}
const qnPersonSegmentModel = new QNPersonSegmentModel();
