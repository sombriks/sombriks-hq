<script>
import links from "../assets/links.json";

import { page } from "vue-analytics";
export default {
  name: "links",
  data() {
    return {
      links,
    };
  },
  methods:{
    track () {
      page(`/#${this.$route.fullPath}`)
    }
  }
};
</script>
<template>
  <div>
    <a v-for="l in links" :key="l.link" target="_blank" :href="l.link">{{
      l.label
    }}</a>
  </div>
</template>
<style module lang="scss">
@import "../design";
</style>
