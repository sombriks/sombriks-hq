<template>
  <!-- <div class="root">
  <menu-bar/>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
  </div>-->
  <v-app dark>
    <v-navigation-drawer app v-model="drawer" width="480">
      <menu-bar/>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <h1>{{title}}</h1>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
const { mapState } = require("vuex");
module.exports = {
  name: "App",
  data: _ => ({ drawer: false }),
  computed: mapState(["title"])
};
</script>

<style scoped>
.root {
  margin: 5px 5px 5px 5px;
  padding: 5px 5px 5px 5px;
}
</style>
