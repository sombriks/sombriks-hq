<template>
  <div :class="$style.footer">
      <div>&copy; sombriks (Leonardo Silveira) {{ year }}</div>
      <div :class="$style.contacts">
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
        <a :class="$style.e3" target="_blank" :href="`${cv.contact.polywork}`">
          <span class="icon-link"></span>
        </a>
        <!-- <a :class="$style.e3" target="_blank" :href="`tel:${cv.contact.telefone}`">
        <span class="icon-phone"></span>
      </a> -->
      </div>
    </div>
</template>

<script>
import cv from "../assets/curriculum.json";

const year = new Date().getFullYear();

export default {
  name: "SiteFooter",
  data() {
    return {year, cv};
  },
}
</script>
<style lang="scss" module>
@import "../design";

.footer {
  display: flex;
  flex-direction: column;
  margin-top: 5em;
}
.contacts {
  display: flex;
}

.e3 {
  display: inline-block;
}
</style>