<template>
  <div>
    <h3>Contact info</h3>
    <div :class="$style.wrap">
      <a
        :class="$style.e3"
        target="_blank"
        :href="`mailto:${cv.contact.email}`"
      >
        <img :class="$style.w100" src="/icons/email.svg" />
      </a>
      <a :class="$style.e3" target="_blank" :href="`${cv.contact.github}`">
        <img :class="$style.w100" src="/icons/github.svg" />
      </a>
      <a
        :class="$style.e3"
        target="_blank"
        :href="`${cv.contact.stackoverflow}`"
      >
        <img :class="$style.w100" src="/icons/stackoverflow.svg" />
      </a>
      <a :class="$style.e3" target="_blank" :href="`${cv.contact.linkedin}`">
        <img :class="$style.w100" src="/icons/linkedin.svg" />
      </a>
      <a :class="$style.e3" target="_blank" :href="`${cv.contact.twitter}`">
        <img :class="$style.w100" src="/icons/twitter.svg" />
      </a>
      <a :class="$style.e3" target="_blank" :href="`${cv.contact.facebook}`">
        <img :class="$style.w100" src="/icons/facebook.svg" />
      </a>
      <a :class="$style.e3" target="_blank" :href="`${cv.contact.instagram}`">
        <img :class="$style.w100" src="/icons/instagram.svg" />
      </a>
      <!-- <a :class="$style.e3" target="_blank" :href="`tel:${cv.contact.telefone}`">
        <img :class="$style.w100" src="/icons/telefone.svg"/>
      </a> -->
    </div>
    <photo-roussel />
  </div>
</template>
<script>
import cv from "../assets/curriculum.json";
import PhotoRoussel from "../components/PhotoRoussel";

import { page } from "vue-analytics";
export default {
  name: "contact",
  components: { PhotoRoussel },
  data() {
    return {
      cv,
    };
  },
  methods: {
    track() {
      page(`/#${this.$route.fullPath}`);
    },
  },
};
</script>
<style module lang="scss">
@import "../design";
.w100 {
  width: 100%;
  fill: $color1;
}
.e3 {
  width: 3em;
}
</style>
