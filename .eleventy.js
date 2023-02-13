const pluginWebc = require("@11ty/eleventy-plugin-webc");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");


module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/**/*.webc",
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: "src/pages",
      layouts: "../layouts",
      data: "../assets",
      output: "dist",
    }
  }
};