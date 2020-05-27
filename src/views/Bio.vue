<template>
  <div>
    <p>
      If you need a print-friendly version click
      <i><span @click="makeCV">here</span></i
      >.
    </p>
    <h3>Professional experience</h3>
    <my-card v-for="(w, i) in cv.work" :key="`w${i}`">
      <template #header>
        <h4>{{ w.position }} at {{ w.company }}</h4>
      </template>
      <template #default>
        <i>{{ w.start }} to {{ w.end }}</i>
        <p>
          {{ w.description }}
        </p>
        <h5>Projects/Client</h5>
        <ul>
          <li v-for="p in w.projects" :key="p.name">
            <b>{{ p.name }}</b> -
            <i>{{ p.description }}</i>
          </li>
        </ul>
        <h6>Tech stack</h6>
        <div :class="$style.wrap">
          <a
            v-for="st in w.techstack"
            :key="st"
            :target="st"
            :href="`https://bing.com?q=${st}`"
            >{{ st }}</a
          >
        </div>
      </template>
    </my-card>
    <h3>Education</h3>
    <my-card v-for="(w, i) in cv.education" :key="`e${i}`">
      <template #header>
        <h4>{{ w.course }} at {{ w.institution }}</h4>
      </template>
      <template #default>
        <i>{{ w.start }} to {{ w.end }}</i>
        <p>
          {{ w.description }}
        </p>
      </template>
    </my-card>
  </div>
</template>
<script>
import cv from "../assets/curriculum.json";
import MyCard from "../components/MyCard";
import { makeCV } from "../components/make-cv-pdf";

export default {
  name: "bio",
  components: { MyCard },
  data() {
    return { cv };
  },
  methods: {
    makeCV,
  },
};
</script>
<style module lang="scss">
@import "../design";
</style>
