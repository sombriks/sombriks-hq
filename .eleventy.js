const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/**/*.webc",
  });

  return {
    dir: {
      input: "src/pages",
      layouts: "../layouts",
      data: "../assets",
      output: "dist",
    }
  }
};