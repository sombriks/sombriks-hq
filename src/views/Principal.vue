<template>
  <div :class="$style.container">
      <h1>Sombriks Has a Plan</h1>
      <router-link to="/bio">Bio</router-link>
      <router-link to="/blog">Blog</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/experiments">Experiments</router-link>
      <router-link to="/links">Links</router-link>
  </div>
</template>

<script>
export default {
  name:"principal"
}
</script>

<style module lang="scss">
@import '../design';
</style>