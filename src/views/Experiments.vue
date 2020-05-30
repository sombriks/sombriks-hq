<template>
  <div>
    <i>coming soon...</i>
  </div>
</template>
<script>
import { page } from "vue-analytics";
export default {
  name: "experiments",
  methods: {
    track() {
      page(`/#${this.$route.fullPath}`);
    },
  },
};
</script>
