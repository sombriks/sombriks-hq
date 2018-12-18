<template>
<div class="root">
  <menu-bar/>
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
module.exports = {
  name: "App"
};
</script>

<style scoped>
.root {
  margin: 5px 5px 5px 5px;
  padding: 5px 5px 5px 5px;
}
</style>
