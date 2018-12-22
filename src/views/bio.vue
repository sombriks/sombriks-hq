<template>
  <div>
    <p>Born in 1984, Male.</p>
    <p>Made in Brazil.</p>
    <p>Thinker. Coder.</p>
    <p>Chaotic evil.</p>
    <p>Never stops to get amazed on how a problem can be torn apart into smaller pieces.</p>
    <p>Quite unable to understand the fiercer mad love that some people have for Soccer teams.</p>
    <p>Running guy, Biking guy. Swimming guy sometimes.</p>
    <p>Gamer when it's possible.</p>
    <p>Have a hard time to see the difference between code and have fun.</p>
    <p>
      Think that to
      <i>reimagine</i> how people do their daily tasks is the real purpose of create better software.
    </p>
    <h2>Contact</h2>
    <p>You can contact me on these social networks:</p>
    <ul>
      <li>
        <a target="fb" href="https://www.facebook.com/sombriks">Facebook</a>
      </li>
      <li>
        <a target="tw" href="https://twitter.com/sombriks">Twitter</a>
      </li>
      <li>
        <a target="in" href="https://www.linkedin.com/in/sombriks/">Linkedin</a>
      </li>
      <li>
        <a target="kk" href="https://www.hackerrank.com/sombriks">HackerRank</a>
      </li>
      <li>
        <a
          target="so"
          href="https://stackoverflow.com/users/420096/sombriks?tab=profile"
        >Stack Overflow</a>
      </li>
      <li>
        <a target="gh" href="https://github.com/sombriks">Github</a>
      </li>
      <li>
        <a target="np" href="https://www.npmjs.com/~sombriks">NPM</a>
      </li>
    </ul>
  </div>
</template>
<script>
module.exports = {
  name: "Bio",
  mounted() {
    this.$store.commit("setTitle", "About Myself");
  },
  data: _ => ({})
};
</script>
