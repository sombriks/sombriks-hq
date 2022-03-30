<template>
  <div>
    <h3>Contact info</h3>
    <photo-roussel />
    <div :class="$style.wrap">
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
      <a :class="$style.e3" target="_blank" :href="`${cv.contact.facebook}`">
        <span class="icon-facebook2"></span>
      </a>
      <a :class="$style.e3" target="_blank" :href="`${cv.contact.instagram}`">
        <span class="icon-instagram"></span>
      </a>
      <!-- <a :class="$style.e3" target="_blank" :href="`tel:${cv.contact.telefone}`">
        <span class="icon-phone"></span>
      </a> -->
    </div>
  </div>
</template>
<script>
import cv from "../assets/curriculum.json";
import PhotoRoussel from "../components/PhotoRoussel";

export default {
  name: "contact",
  components: { PhotoRoussel },
  data() {
    return {
      cv,
    };
  }
};
</script>
<style module lang="scss">
@import "../design";
.e3 {
  width: 2em;
  font-size: 2em;
  justify-content: center;
}
</style>
