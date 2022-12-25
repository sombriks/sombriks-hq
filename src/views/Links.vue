<template>
  <div>
    <a :class="$style.compact" v-for="l in links"
       :key="l.link" target="_blank" :href="l.link">
      {{ l.label }}
    </a>
  </div>
</template>
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
<style module lang="scss">
@import "../design";

a.compact {
  display: inline-block;
}
</style>
