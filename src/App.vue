<template>
  <div :class="$style.container">
    <h1><router-link to="/principal">{{ $store.state.title }}</router-link></h1>
    <NavBar/>
    <div v-if="backVisible">
      <router-link :to="back">Back</router-link>
    </div>
    <div class="container">
      <router-view/>
    </div>
    <SiteFooter/>
  </div>
</template>
<script>
import {changeTheme, themes} from "./components/themes";
import NavBar from "./components/NavBar.vue";
import SiteFooter from "./components/SiteFooter.vue";

export default {
  name: "app",
  data() {
    return {};
  },
  mounted() {
    let x = themes.length;
    let i = Math.floor(Math.random() * x);
    this.$store.commit("setIndex", changeTheme(i));
  },
  computed: {
    backVisible() {
      return this.$route.path.match(/\/blog\/.+/);
    },
    back() {
      if (this.backVisible) {
        return "/blog"
      } else { //if (this.$route.path != '/principal')
        return "/principal";
      }
    }
  },
  components: {NavBar, SiteFooter},
};
</script>
<style lang="scss" module>
@import "./design";
</style>

<style scoped>
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
