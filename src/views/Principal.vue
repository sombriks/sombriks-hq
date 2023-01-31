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
      welcome: "keep it simple"
    }
  },
  mounted() {
    this.$router.push(`/blog/${this.posts[parseInt(Math.random() * this.posts.length)]}`);
  },
  beforeDestroy() {
  }
};
</script>

<style module lang="scss">
@import "../design";
</style>
