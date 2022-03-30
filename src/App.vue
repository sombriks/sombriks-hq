<template>
  <div :class="$style.container">
    <h1>{{ $store.state.title }}</h1>
    <ThemeSelector />
    <div>
      <router-link v-if="$route.path != '/principal'" to="/principal"
        >Back</router-link
      >
    </div>
    <div class="container">
      <router-view />
    </div>
    <div id="footer">&copy; sombriks (a.k.a. Leonardo Silveira) {{ year }}</div>
  </div>
</template>
<script>
import { changeTheme, themes } from "./components/themes";
import ThemeSelector from "./components/ThemeSelector.vue";
const year = new Date().getFullYear();

export default {
  name: "app",
  data() {
    return { year };
  },
  mounted() {
    let x = themes.length;
    let i = Math.floor(Math.random() * x);
    changeTheme(i);
  },
  components: { ThemeSelector },
};
</script>
<style lang="scss" module>
@import "./design";
</style>

<style scoped>
#footer {
  margin-top: 5em;
}
@media (max-width: 479px) {
  .container {
    max-width: 99%;
  }
}
@media (min-width: 480px) {
  .container {
    max-width: 95%;
  }
}
@media (min-width: 800px) {
  .container {
    max-width: 75%;
  }
}
@media (min-width: 1440px) {
  .container {
    max-width: 50%;
  }
}
@media (min-width: 1920px) {
  .container {
    max-width: 40%;
  }
}
</style>
