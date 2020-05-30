<template>
  <div>
    <router-link :class="$style.row" to="/bio">Bio</router-link>
    <router-link :class="$style.row" to="/blog">Blog</router-link>
    <router-link :class="$style.row" to="/contact">Contact</router-link>
    <router-link :class="$style.row" to="/experiments">Experiments</router-link>
    <router-link :class="$style.row" to="/links">Links</router-link>
  </div>
</template>

<script>
import { page } from "vue-analytics";
export default {
  name: "principal",
  methods: {
    track() {
      page(`/#${this.$route.fullPath}`);
    },
  },
};
</script>

<style module lang="scss">
@import "../design";
</style>
