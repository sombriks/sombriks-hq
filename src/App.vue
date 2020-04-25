<template>
  <div :class="$style.base" class="base">
    <router-link
      v-if="$route.path != '/principal'"
      to="/principal"
      >Back</router-link
    >
    <h1>Current Title</h1>
    <Search />
    <router-view />
    <div id="footer">&copy; sombriks (a.k.a. Leonardo Silveira) {{ year }}</div>
  </div>
</template>
<script>
const year = new Date().getFullYear();
import Search from "./components/Search";

export default {
  components: { Search },
  name: "app",
  data() {
    return { year };
  }
};
</script>
<style lang="scss" module>
@import "./design";
.back {
  position: fixed;
  top: 5px;
  left: 5px;
  background-color: white;
}
</style>
