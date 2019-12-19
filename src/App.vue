<template>
  <div id="container">
    <div id="nav">
      <router-link to="/bio">Bio</router-link>
      <router-link to="/blog">Blog</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/experiments">Experiments</router-link>
      <router-link to="/links">Links</router-link>
    </div>
    <div id="content">
      <router-view />
      <div id="footer">
        &copy; sombriks (a.k.a. Leonardo Silveira) {{ year }}
      </div>
    </div>
  </div>
</template>
<script>
const year = new Date().getFullYear();
export default {
  name: "app",
  data() {
    return { year };
  }
};
</script>
<style scoped>
#container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
#nav,
#content,
#footer {
  display: flex;
}
#content {
  flex-direction: column;
  min-height: 600px;
}
#footer {
  width: 100%;
  justify-content: center;
  align-self: flex-end;
}
@media (min-width: 800px) {
  #nav {
    flex-grow: 4;
    flex-direction: column;
  }
  #nav > a {
    align-self: flex-start;
    padding: 1em;
  }
  #content {
    flex-grow: 8;
  }
}
@media (max-width: 799px) {
  #container {
    flex-direction: column;
  }
  #nav {
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }
  #nav > a {
    align-self: flex-start;
    padding: 1em;
  }
}
</style>
