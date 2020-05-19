<template>
  <div>
    <my-card>
      <template #header>
        <h2>Teste</h2>

      </template>
      AAA
    </my-card>
  </div>
</template>
<script>
import cv from "../assets/curriculum.json";
import MyCard from "../components/MyCard";
export default {
  name: "bio",
  components: { MyCard },
  data() {
    return { cv };
  },
};
</script>
