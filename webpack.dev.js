const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

const webpackDevConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    port: 8898,
    static: {
      directory: path.join(__dirname, "./"),
    },
  },
};

async function config() {
  const commonConfig = await common();
  return merge(webpackDevConfig, commonConfig);
}

module.exports = config;
