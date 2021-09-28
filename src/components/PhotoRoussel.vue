<template>
    <div :class="$style.container">
      <img :class="$style.eimg" :src="pics[i]" @click="nextPic" />
    </div>
</template>
<script>
export default {
  name: "photo-roussel",
  data() {
    return {
      i: 0,
      pics: [
        "/profile-pics/picture_07.png",
        "/profile-pics/picture_08.jpg",
        "/profile-pics/picture_09.jpg",
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
        "/profile-pics/picture_25.jpg",
        "/profile-pics/picture_26.jpg",
      ],
      interval: null,
    };
  },
  mounted() {
    this.interval = setInterval(this.nextPic, 4500);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    nextPic() {
      this.i += 1;
      if (this.i >= this.pics.length) this.i = 0;
    },
  },
};
</script>
<style module lang="scss">
@import "../design";
.w100 {
  width: 100%;
  fill: var(--color1);
}
.e3 {
  width: 3em;
}
.eimg {
  width: 9em;
}
</style>
