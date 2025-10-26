import pugPlugin from "@11ty/eleventy-plugin-pug";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.addPlugin(pugPlugin);
  eleventyConfig.setOutputDirectory("dist");
}