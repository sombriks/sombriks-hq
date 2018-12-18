<template>
  <div>
    <a v-for="r in routes" v-if="r.urlitem" :href="`#${r.urlitem}`" :key="r.path">{{r.label}}</a>
  </div>
</template>

<script>
module.exports = {
  name: "MenuBar",
  data: _ => ({
    routes: require("../routes").routes
  })
};
</script>
