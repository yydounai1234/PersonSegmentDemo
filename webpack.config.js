const WebpackObfuscator = require('webpack-obfuscator');
module.exports = {
  mode: "development",
  watch: false,
  entry: "./perform-origin.js",
  output: {
    // eslint-disable-next-line node/no-path-concat
    path: __dirname + "/sdk/segmented/",
    filename: "index.js",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" , options: { filename: '[hash].worker.js' }},
      },
    ],
  },
//   plugins: [
//     new WebpackObfuscator ({
//         rotateStringArray: true
//     })
// ]
};
