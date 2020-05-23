<template>
  <div :class="$style.card">
    <div :class="$style.cardContent">
      <slot name="header"></slot>
      <hr/>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-card",
};
</script>

<style module lang="scss">
@import "../design";
.card {
  border: 1px solid $color1;
  border-radius: 0.6em;
  box-shadow: 1px;
  min-width: 200px;
  margin: 1em;
}
.cardContent {
  margin: 1em;
}
</style>
