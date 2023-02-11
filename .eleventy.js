const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/components/**/*.webc",
  });

  return {
    dir: {
      layouts: "../layouts",
      input: "src/pages",
      output: "dist",
    }
  }
};