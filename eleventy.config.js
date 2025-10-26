import pugPlugin from "@11ty/eleventy-plugin-pug";

export default function (eleventyConfig) {
  // static assets
  eleventyConfig.addPassthroughCopy({"node_modules/@owickstrom/the-monospace-web/src": "/the-monospace-web"});
  eleventyConfig.addPassthroughCopy({"public": "/"});
  // root folder and others
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setIncludesDirectory("components")
  eleventyConfig.setLayoutsDirectory("layouts");
  // destination
  eleventyConfig.setOutputDirectory("dist");
  // misc plugins
  eleventyConfig.addPlugin(pugPlugin);
}
