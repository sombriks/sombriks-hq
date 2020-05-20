<script>
import links from "../assets/links.json";
export default {
  name: "links",
  data() {
    return {
      links,
    };
  },
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
