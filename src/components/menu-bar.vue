<template>
  <div>
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
