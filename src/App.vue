<template>
  <div :class="$style.container">
    <h1>{{ $store.state.title }}</h1>
    <div>
      <router-link v-if="$route.path != '/principal'" to="/principal"
        >Back</router-link
      >
    </div>
    <router-view />
    <div id="footer">&copy; sombriks (a.k.a. Leonardo Silveira) {{ year }}</div>
  </div>
</template>
<script>
const year = new Date().getFullYear();

export default {
  name: "app",
  data() {
    return { year };
  },
};
</script>
<style lang="scss" module>
@import "./design";

</style>
