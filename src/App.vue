<template>
  <div>
    <h1>{{$store.state.title}}</h1>
    <router-link
      v-if="$route.path != '/principal'"
      to="/principal"
      >Back</router-link
    >
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
</style>
