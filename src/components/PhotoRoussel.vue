<template>
    <div :class="$style.container">
      <img :class="$style.eimg" :src="`/profile-pics/${pics[i]}`" @click="nextPic" />
    </div>
</template>
<script>
import pics from "../assets/pics.json";

export default {
  name: "photo-roussel",
  data() {
    return {
      i: 0,
      pics,
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
