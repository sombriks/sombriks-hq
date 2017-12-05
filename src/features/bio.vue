<template>
  <div>
    <img :src="picture" width="200" height="200" alt="Gravatar Profile Picture" title="click to change" @click="changepic"/>
    <h1>Bio</h1>
    <p>Born in 1984, Male.</p>
    <p>Made in Brazil.</p>
    <p>Thinker. Coder.</p>
    <p>Never stops to get amazed on how a problem can be torn apart into smaller pieces.</p>
    <p>Quite unable to understand the fiercer mad love that some people have for Soccer teams.</p>
    <p>Running guy, Biking guy. Swimming guy sometimes.</p>
    <p>Gamer when it's possible.</p>
    <p>Have a hard time to see the difference between code and have fun.</p>
    <p>You can follow me on these social networks:</p>
    <ul>
      <li><a target="fb" href="https://www.facebook.com/sombriks">Facebook</a></li>
      <li><a target="tw" href="https://twitter.com/sombriks">Twitter</a></li>
      <li><a target="gh" href="https://github.com/sombriks">Github</a></li>
      <li><a target="in" href="https://www.linkedin.com/in/sombriks/">Linkedin</a></li>
    </ul>
  </div>
</template>
<script>
module.exports = {
  name: "Bio",
  data: _ => ({
    idx: 0,
    picture: "assets/profile-pics/picture_16.jpg",
    pictures: [
      "assets/profile-pics/picture_16.jpg",
      "assets/profile-pics/picture_15.jpg",
      "assets/profile-pics/picture_13.jpg",
      "assets/profile-pics/picture_12.jpg",
      "assets/profile-pics/picture_11.jpg",
      "assets/profile-pics/picture_10.jpg",
      "assets/profile-pics/picture_9-a.jpg",
      "assets/profile-pics/picture_9.jpg",
    ]
  }),
  methods: {
    changepic() {
      this.idx = (this.idx + 1) % this.pictures.length;
      this.picture = this.pictures[this.idx];
    }
  }
};
</script>
