<template>
  <div>
    <h1>Blog</h1>
    <a v-for="p in listing" :href="`#/blog/${p}`" :key="p" @click="getpost(p)">{{p}}</a>
    <br>
    <br>
    <div v-html="content"></div>
  </div>
</template>

<script>
const fs = require("fs");
const axios = require("axios");
const marked = require("marked");
marked.setOptions({
  highlight: function(code) {
    return require("highlight.js").highlightAuto(code).value;
  },
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});
module.exports = {
  name: "Blog",
  data: _ => ({
    listing: fs
      .readdirSync("assets/posts")
      .filter(e => e.endsWith(".md"))
      .reverse(),
    content: "Sometimes i write down something."
  }),
  created() {
    if (this.$route.params.post) this.getpost(this.$route.params.post);
  },
  methods: {
    getpost(post) {
      axios
        .get(`assets/posts/${post}`)
        .then(ret => (this.content = marked(ret.data)));
    }
  }
};
</script>

<style>
</style>
