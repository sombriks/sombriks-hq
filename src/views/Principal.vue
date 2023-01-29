<template>
  <div>
    <i>{{ welcome }}</i>
  </div>
</template>

<script>
import posts from "../assets/posts";

export default {
  name: "principal",
  data() {
    return {
      posts,
      unsure: null,
      aboutToGo: null,
      welcome: "keep it simple"
    }
  },
  mounted() {
    this.unsure = setTimeout(() => {
      this.welcome = "Unsure about what to read? Let me choose for you!";
      this.aboutToGo = setTimeout(() => {
        this.$router.push(`/blog/${this.posts[parseInt(Math.random() * this.posts.length)]}`);
      }, 1500);
    }, 2000);
  },
  beforeDestroy() {
    clearTimeout(this.aboutToGo);
    clearTimeout(this.unsure);
  }
};
</script>

<style module lang="scss">
@import "../design";
</style>
