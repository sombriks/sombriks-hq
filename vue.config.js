const path = require("path");
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set("~", path.resolve(__dirname, "src"));
    config.module
      .rule("markdown")
      .test(/.*\.md/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  productionSourceMap: false,
};
