<template>
  <div :class="$style.container">
    <h1>{{ $store.state.title }}</h1>
    <nav>
      <router-link :class="$style.row" to="/bio">Bio</router-link>
      <div class="sep">|</div>
      <router-link :class="$style.row" to="/blog">Blog</router-link>
      <div class="sep">|</div>
      <router-link :class="$style.row" to="/experiments">Experiments</router-link>
      <div class="sep">|</div>
      <router-link :class="$style.row" to="/links">Links</router-link>
      <div class="sep">|</div>
      <ThemeSelector/>
      <div class="sep">|</div>
      <router-link :class="$style.row" to="/privacy">Privacy</router-link>
    </nav>
    <div v-if="backVisible">
      <router-link :to="back">Back</router-link>
    </div>
    <div class="container">
      <router-view/>
    </div>
    <div id="footer">
      <div>&copy; sombriks (Leonardo Silveira) {{ year }}</div>
      <div>
        <a
            :class="$style.e3"
            target="_blank"
            :href="`mailto:${cv.contact.email}`"
        >
          <span class="icon-mail4"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.github}`">
          <span class="icon-github"></span>
        </a>
        <a
            :class="$style.e3"
            target="_blank"
            :href="`${cv.contact.stackoverflow}`"
        >
          <span class="icon-stackoverflow"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.linkedin}`">
          <span class="icon-linkedin"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.twitter}`">
          <span class="icon-twitter"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.mastodon}`">
          <span class="icon-mastodon"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.facebook}`">
          <span class="icon-facebook2"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.instagram}`">
          <span class="icon-instagram"></span>
        </a>
        <a :class="$style.e3"
           target="_blank"
           :href="`${cv.contact.hackerrank}`">
          <span class="icon-hackerrank"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.reddit}`">
          <span class="icon-reddit"></span>
        </a>
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.keybase}`">
          <span class="icon-keybase"></span>
        </a>
        <!-- <a :class="$style.e3" target="_blank" :href="`tel:${cv.contact.telefone}`">
        <span class="icon-phone"></span>
      </a> -->
      </div>
    </div>
  </div>
</template>
<script>
import cv from "./assets/curriculum.json";
import {changeTheme, themes} from "./components/themes";
import ThemeSelector from "./components/ThemeSelector.vue";

const year = new Date().getFullYear();

export default {
  name: "app",
  data() {
    return {year, cv};
  },
  mounted() {
    let x = themes.length;
    let i = Math.floor(Math.random() * x);
    this.$store.commit("setIndex", changeTheme(i));
  },
  computed: {
    backVisible() {
      return this.$route.path.match(/\/blog\/.+/);
    },
    back() {
      if (this.backVisible) {
        return "/blog"
      } else { //if (this.$route.path != '/principal')
        return "/principal";
      }
    }
  },
  components: {ThemeSelector},
};
</script>
<style lang="scss" module>
@import "./design";

a.e3 {
  display: inline-block;
}
</style>

<style scoped>
nav {
  display: flex;
  margin-bottom: 2em;
}

nav > .sep {
  margin-top: 0.5em;
}

#footer {
  margin-top: 5em;
}

@media (max-width: 479px) {
  .container {
    max-width: 99%;
  }

  #footer {
    margin-top: 1em;
  }
}

@media (min-width: 480px) {
  .container {
    max-width: 95%;
  }

  #footer {
    margin-top: 2em;
  }
}

@media (min-width: 800px) {
  .container {
    max-width: 75%;
  }

  #footer {
    margin-top: 3em;
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 50%;
  }
}

@media (min-width: 1920px) {
  .container {
    max-width: 40%;
  }
}
</style>
