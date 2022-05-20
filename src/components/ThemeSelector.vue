<template>
  <div>
    <div v-if="!menu" class="box" @click="showHide">
      <div class="l">{{ $store.state.index }}</div>
      <div class="r"></div>
    </div>
    <div class="options" v-if="menu">
      <div
        v-for="(theme, i) in themes"
        :key="theme[0] + theme[1]"
        @click="change(i - 1)"
        class="option"
        style="background-color: white"
      >
        <div
          class="l"
          :style="{ color: theme[1], 'background-color': theme[0] }"
        >
          {{ i }}
        </div>
        <div class="r" :style="{ 'background-color': theme[0] }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeTheme, themes } from "./themes";

export default {
  name: "theme-selector",
  data() {
    return {
      themes,
      menu: false,
    };
  },
  methods: {
    change(i) {
      this.$store.commit("setIndex", changeTheme(i));
      this.menu = false;
    },
    showHide() {
      this.menu = !this.menu;
    },
  },
};
</script>

<style scoped>
.box,
.options {
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

.options {
  opacity: 0.775;
  flex-direction: column;
  display: flex;
  animation-name: expand;
  animation-duration: 3s;
}

.option {
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  min-height: 0;
  min-width: 0;
}

@keyframes expand {
  from {
    max-height: 0px;
  }

  25% {
    max-height: 20%;
  }

  75% {
    max-height: 80%;
  }

  to {
    max-height: max-content;
  }
}
</style>
