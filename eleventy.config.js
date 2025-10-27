import pugPlugin from "@11ty/eleventy-plugin-pug";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import YAML from "yaml";

export default function (eleventyConfig) {
  // static assets
  eleventyConfig.addPassthroughCopy({ "node_modules/@owickstrom/the-monospace-web/src": "/the-monospace-web" });
  eleventyConfig.addPassthroughCopy({ "public": "/" });
  // root folder and others
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setIncludesDirectory("components")
  eleventyConfig.setLayoutsDirectory("layouts");
  eleventyConfig.setDataDirectory("data");
  // destination
  eleventyConfig.setOutputDirectory("dist");
  // misc plugins
  eleventyConfig.addPlugin(pugPlugin);
  eleventyConfig.addDataExtension("yml,yaml", (contents) => YAML.parse(contents));
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss", // or "rss", "json"
    outputPath: "/feed.xml",
    collection: {
      name: "posts", // iterate over `collections.posts`
      limit: 10,     // 0 means no limit
    },
    metadata: {
      language: "en",
      title: "Sombriks Has a Plan",
      subtitle: "Technology, opensource and so on",
      base: "https://sombriks.com/",
      author: {
        name: "Leonardo Silveira",
        email: "", // Optional
      }
    }
  });
}
