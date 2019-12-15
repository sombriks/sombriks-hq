<template>
  <div id="container">
    <div id="nav">
      <router-link to="/bio">Bio</router-link> |
      <router-link to="/blog">Bio</router-link> |
      <router-link to="/contact">Bio</router-link> |
      <router-link to="/experiments">Bio</router-link> |
      <router-link to="/links">Bio</router-link>
    </div>
    <div id="content">
      <router-view />
    </div>
    <div id="footer">
      &copy; sombriks (a.k.a. Leonardo Silveira) {{year}} 
    </div>
  </div>
</template>
<script>
const year = new Date().getFullYear()
export default {
  name:"app",
  data(){
    return {year}
  }
}
</script>
<style scoped>
  #container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  #footer {
    display: flex;
    width:100%;
    justify-content: center;
    align-self: flex-end;
  }
  @media (orientation: landscape) and (min-width: 800px) {

  }
</style>