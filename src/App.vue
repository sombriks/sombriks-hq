<template>
  <div :class="$style.container">
    <router-link v-if="$route.path != '/principal'" :class="$style.back" to="/principal">Back</router-link>
    <Search/>
    <div id="content">
      <router-view />
    </div>
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
  position:fixed;
  top:5px;
  left:5px;
  background-color: white;
}
</style>
