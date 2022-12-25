<template>
  <div class="parent">
    <div v-if="!menu" class="box" @click="showHide">
      <div class="l">Theme</div>
      <div class="r">{{ $store.state.index }}</div>
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
          Theme
        </div>
        <div class="r" :style="{ color: theme[0], 'background-color': theme[1] }"> {{ i }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {changeTheme, themes} from "./themes";

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
.parent {
  margin-top: 0.5em;
}

.box,
.options {
  position: absolute;
  /*top: 0.5em;*/
  /*left: 0.5em;*/
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
  min-width: 2em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  text-align: center;
}

.r {
  background-color: var(--color1);
  color: var(--color0);
  min-height: 1em;
  min-width: 2em;
  text-align: center;
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
