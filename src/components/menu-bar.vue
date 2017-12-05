<template>
  <div class="bar">
    <a v-for="r in routes" :href="`#${r.path}`" :key="r.path">{{r.label}}</a>
  </div>
</template>

<script>
module.exports = {
  name: "MenuBar",
  data: _ => ({
    routes: require("./routes")
  })
};
</script>

<style scoped>
.bar {
  margin: 10px 10px 10px 10px;
}
</style>
