const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const webpackProdConfig = {
  mode: "production",
};

async function config() {
  const commonConfig = await common();
  return merge(webpackProdConfig, commonConfig);
}

module.exports = config;
