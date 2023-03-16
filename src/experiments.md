---
layout: base.webc
---

# Experiments

For a long time i planned to post here nice products, showcases and so on.

But every time i was thinking: is it really worth be called a finished up
product? and most of the cases the answer is now.

However, by doing it, i am impeding people to see a curated list of potentially
useful repositories present on [my github](https://github.com/sombriks?tab=repositories)

Therefore, i'll add here not only _finished_ solutions, but als my exploration
projects.

## [rosetta-beer-store](https://github.com/sombriks/rosetta-beer-store)

This is a very cool test project. Here i redo several times interchageable
clients and services, proving that separation offers such great degree of
transparency between solution layers but also producing some comments on which
approach is simper, which one is easier, and who gets more performance. It's a
must-see if you're in the process to choose technologies for your next big thing.

## [node-libgpiod](https://github.com/sombriks/node-libgpiod)

This project is a wrapper for libgpiod to nodejs. By the time i decided to build
a simple remote-controlled car-robot i decided to not use outdated raspberry pi
OS but a modern fedora for arm system.

It happens to fedora does not ships with old gpio library from kernels, but only
userland-safe libgpiod.

So i wrote the C++ wrapper code to make nodejs speak with this general
input/output interface and put that on npm registry

This project is open for contributions, ;-)

## [palavrim](https://github.com/sombriks/palavrim)

**UPDATE**: i am rewriting it.

This one is yet another wordle mutated clone.

Key purpose was to sample a few different ways to implement the game and also
sample a little of [vue.js 3](https://github.com/vuejs/core/blob/main/CHANGELOG.md#3247-2023-02-02).

## [simple-steps-js](https://github.com/sombriks/simple-steps-js)

I had the need for a simple timeline executor so i could perform some actions
with a given delay.

It's a very simple, very humble library so i can reuse it in some frontends more
easily.

## [simple-java-run-cmd](https://github.com/sombriks/simple-java-run-cmd)

This small library helps with process execution and management by a java process.
Useful when your program needs to manage another program.

It's still under construction, but already has a simple testcase showing it's
capabilities.

## [hello-js-v2](https://github.com/sombriks/hello-js-2.0) and [hello-js-v5](https://github.com/sombriks/hello-js-v5) trainings

These old node trainings where useful back in time to help my fellow students to
fast track into trainee positions.

They are outdated right now but still worth as a picture of the state of node
and javascript development back in 2016.

## _more to come_

This list is a work in progress, if i create something new or find some
cabalistic git repo of mine worth to land here it will appear eventually.
