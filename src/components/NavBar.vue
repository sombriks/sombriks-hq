<template>
  <nav>
      <router-link to="/bio">Bio</router-link>
      <div class="sep">|</div>
      <router-link to="/blog">Blog</router-link>
      <div class="sep">|</div>
      <router-link to="/experiments">Experiments</router-link>
      <div class="sep">|</div>
      <router-link to="/links">Links</router-link>
      <div class="sep">|</div>
      <ThemeSelector/>
      <div class="sep">|</div>
      <router-link to="/privacy">Privacy</router-link>
    </nav>
</template>
<script>
import ThemeSelector from "./ThemeSelector.vue";

export default {
  components:{ThemeSelector}
}
</script>

<style lang="scss" module>
@import "../design";

</style>

<style scoped>

nav {
  display: flex;
  margin-bottom: 2em;
}

nav > .sep {
  margin-top: 0.5em;
}
</style>