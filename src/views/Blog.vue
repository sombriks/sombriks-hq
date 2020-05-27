<template>
  <div>
    <div v-if="!current" :class="$style.wrap">
      <router-link tag="a" :to="`/blog/${p}`" v-for="p in posts" :key="p">
        {{ p }}
      </router-link>
    </div>
    <pre v-if="current">
      {{current}}
    </pre>
  </div>
</template>
<script>
import posts from "../assets/posts";
export default {
  name: "blog",
  data() {
    return { posts, current: "" };
  },
  mounted() {
    this.carrega();
  },
  watch: {
    "$route.params.post"() {
      this.carrega();
    },
  },
  methods: {
    carrega() {
      const p = this.$route.params.post;
      if (!p) return;
      import(`../assets/posts/${p}`).then((module) => {
        // console.log(module);
        this.current = module.default;
      });
    },
  },
};
</script>
<style module lang="scss">
@import "../design";
</style>
