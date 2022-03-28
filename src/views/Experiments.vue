<template>
  <div>
    <h1>Experiments</h1>
    <p>
      For a long time i planned to post here nice products, showcases and so on.
    </p>
    <p>
      But every time i was thinking: is it really worth be called a finished up
      product? and most of the cases the answer is now.
    </p>
    <p>
      However, by doing it, i am impeding people to see a curated list of
      potentially useful repositories present on [my
      github](https://github.com/sombriks?tab=repositories)
    </p>
    <p>
      Therefore, i'll add here not only <i>finished</i> solutions, but als my
      exploration projects.
    </p>
    <h2>
      <a href="https://github.com/sombriks/rosetta-beer-store"
        >rosetta-beer-store</a
      >
    </h2>
    <p>
      This is a very cool test project. Here i redo several times interchageable
      clients and services, proving that separation offers such great degree of
      transparency between solution layers but also producing some comments on
      which approach is simper, which one is easier, and who gets more
      performance. It's a must-see if you're in the process to choose
      technologies for your next big thing.
    </p>
    <h2>
      <a href="https://github.com/sombriks/node-libgpiod">node-libgpiod</a>
    </h2>
    <p>
      This project is a wrapper for libgpiod to nodejs. By the time i decided to
      build a simple remote-controlled car-robot i decided to not use outdated
      raspberry pi OS but a modern fedora for arm system.
    </p>
    <p>
      It happens to fedora does not ships with old <i>gpio</i> library from
      kernels, but only userland-safe <i>libgpiod</i>.
    </p>
    <p>
      So i wrote the C++ wrapper code to make nodejs speak with this general
      input/output interface and put that on npm registry
    </p>
    <p>This project is open for contributions, ;-)</p>
    <h2>
      <a href="https://github.com/sombriks/palavrim">palavrim</a>
    </h2>
    <p>This one is yet another wordle mutated clone.</p>
    <p>
      It's not even close to completion, missing a few things but you can
      challenge people around the world to discover the word already.
    </p>
    <p>
      Unlike original wordle, this one allows the player to invent and share
      it's own word.
    </p>
    <h2>
      <i><b>More to come</b></i>
    </h2>
    <p>
      This list is a work in progress, if i create something new or find some
      cabalistic git repo of mine worth to land here it will appear eventually.
    </p>
  </div>
</template>
<script>
export default {
  name: "experiments",
};
</script>
