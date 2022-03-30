<template>
  <div class="box" @click="change" @scroll="change">
    <div class="l"></div>
    <div class="r"></div>
  </div>
</template>

<script>
import { changeTheme } from "./themes";

export default {
  name: "theme-selector",
  data() {
    return {};
  },
  methods: {
    change() {
      changeTheme();
    },
  },
};
</script>

<style scoped>
.box {
  position: fixed;
  top: 0.5em;
  left: 0.5em;
  min-height: 1em;
  min-width: 2em;
  border: 2px solid var(--color1);
  border-radius: 4px;
  opacity: 0.3;
  display: flex;
}
.l {
  background-color: var(--color0);
  min-height: 1em;
  min-width: 1em;
}
.r {
  background-color: var(--color1);
  min-height: 1em;
  min-width: 1em;
}
</style>
