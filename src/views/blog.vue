<template>
  <div>
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
    content: "Sometimes i write down something."
  }),
  mounted() {
    if (this.$route.params.post) this.getpost(this.$route.params.post);
    this.$store.commit("setTitle", "Blog");
  },
  methods: {
    getpost(post) {
      axios
        .get(`assets/posts/${post}`)
        .then(ret => {
          this.content = marked(ret.data);
          this.$store.commit("setTitle", post);
        })
        .catch(err => {
          console.log(err);
          this.content = marked("_Hey, it does not exists. Yet._");
        });
    }
  },
  watch: {
    "$route.params.post"(v) {
      if (!v) this.content = marked("_Hey, it does not exists. Yet._");
      else this.getpost(v);
    }
  }
};
</script>

<style>
</style>
