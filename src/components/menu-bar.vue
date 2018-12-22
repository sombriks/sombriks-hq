<template>
  <v-layout column>
    <v-layout column justify-center align-center>
      <small>keep it simple</small>
      <v-avatar size="256">
        <img
          :src="picture"
          width="200"
          height="200"
          alt="Profile Picture"
          title="click to change"
          @click="changepic"
        >
      </v-avatar>
    </v-layout>
    <v-layout column>
      <v-list>
        <v-list-tile v-for="r in routes" :key="r.path" v-if="r.urlitem" :href="`#${r.urlitem}`">
          <v-list-tile-avatar>
            <v-icon>{{ r.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{r.label}}</v-list-tile-title>
        </v-list-tile>
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-avatar>
              <v-icon>collections_bookmark</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Blog</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="p in posts" :key="p" :href="`#/blog/${p}`">
            <v-list-tile-avatar>
              <v-icon>description</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>{{p}}</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-layout>
  </v-layout>
</template>

<script>
const fs = require("fs");
module.exports = {
  name: "MenuBar",
  data: _ => ({
    posts: fs
      .readdirSync("assets/posts")
      .filter(e => e.endsWith(".md"))
      .reverse(),
    routes: require("../routes").routes,
    idx: 0,
    intervalId: null,
    picture: "assets/profile-pics/picture_17.jpg",
    pictures: [
      "assets/profile-pics/picture_8.png",
      "assets/profile-pics/picture_9-a.jpg",
      "assets/profile-pics/picture_9-b.jpg",
      "assets/profile-pics/picture_9.jpg",
      "assets/profile-pics/picture_17.jpg",
      "assets/profile-pics/picture_16.jpg",
      "assets/profile-pics/picture_15.jpg",
      "assets/profile-pics/picture_13.jpg",
      "assets/profile-pics/picture_12.jpg",
      "assets/profile-pics/picture_11.jpg",
      "assets/profile-pics/picture_10.jpg",
      "assets/profile-pics/picture_18.jpg",
      "assets/profile-pics/picture_19.jpg",
      "assets/profile-pics/picture_21.jpg"
    ]
  }),
  mounted() {
    this.intervalId = setInterval(_ => this.changepic(), 5000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    changepic() {
      this.idx = (this.idx + 1) % this.pictures.length;
      this.picture = this.pictures[this.idx];
    }
  }
};
</script>
