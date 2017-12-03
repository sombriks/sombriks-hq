<template>
  <div class="bar">
    <a v-for="r in routes" :href="`#${r.path}`" :key="r.path">{{r.label}}</a>
    <!-- <iframe src="https://ghbtns.com/github-btn.html?user=sombriks&type=follow&count=true&size=large" 
    frameborder="0" scrolling="0" width="220px" height="30px"></iframe>
    <a class="twitter-follow-button"
    href="https://twitter.com/sombriks"
    data-size="large">
    Follow @sombriks</a> -->
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

.bar > a {
  min-height: 30px;
  margin: 10px 10px 10px 10px;
  padding: 5px 5px 5px 5px;
  border: 1px groove white;
  border-radius: 5px;
  color: white;
}
</style>
