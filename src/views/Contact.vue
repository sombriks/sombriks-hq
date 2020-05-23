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
    <div :class="$style.container">
      <img :class="$style.eimg" :src="pics[i]" />
    </div>
  </div>
</template>
<script>
import cv from "../assets/curriculum.json";
export default {
  name: "contact",
  data() {
    return {
      cv,
      i: 0,
      pics: [
        "/profile-pics/picture_8.png",
        "/profile-pics/picture_9-a.jpg",
        "/profile-pics/picture_9-b.jpg",
        "/profile-pics/picture_9.jpg",
        "/profile-pics/picture_10.jpg",
        "/profile-pics/picture_11.jpg",
        "/profile-pics/picture_12.jpg",
        "/profile-pics/picture_13.jpg",
        "/profile-pics/picture_15.jpg",
        "/profile-pics/picture_16.jpg",
        "/profile-pics/picture_17.jpg",
        "/profile-pics/picture_18.jpg",
        "/profile-pics/picture_19.jpg",
        "/profile-pics/picture_21.jpg",
        "/profile-pics/picture_22.jpg",
        "/profile-pics/picture_23.jpg",
        "/profile-pics/picture_24.jpg",
      ],
      interval: null,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.i += 1;
      if (this.i >= this.pics.length) this.i = 0;
    }, 4500);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
<style module lang="scss">
@import "../design";
.w100 {
  width: 100%;
}
.e3 {
  width: 3em;
}
.eimg {
  width: 9em;
}
</style>
