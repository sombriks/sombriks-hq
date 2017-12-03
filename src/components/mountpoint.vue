<template>
<div class="root">
  <menu-bar></menu-bar>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
const VueRouter = require("vue-router");
const router = new VueRouter({
  routes: require("./routes")
});
module.exports = {
  name: "MountPoint",
  router
};
</script>

<style scoped>
.root {
  margin: 5px 5px 5px 5px;
  padding: 5px 5px 5px 5px;
}
</style>
