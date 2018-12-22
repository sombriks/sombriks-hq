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
