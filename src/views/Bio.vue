<template>
  <div>
      <h3>Experiência profissional</h3>
    <my-card v-for="(w,i) in cv.work" :key="i">
      <template #header>
        <h4>{{w.position}} at {{w.company}}</h4>
      </template>
      <template #default>
        <i>{{w.start}} to {{w.end}}</i>
        <p>
          {{w.description}}
        </p>
      </template>
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
