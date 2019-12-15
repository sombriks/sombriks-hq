<template>
  <div>
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
      
    </div>
  </div>
</template>
<script>
export default {
  name:"app"
}
</script>