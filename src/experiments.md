---
layout: base.webc
---

# Experiments

For a long time i planned to post here nice products, showcases and so on.

But every time i was thinking: is it really worth be called a finished up
product? and most of the cases the answer is now.

However, by doing it, i am impeding people to see a curated list of potentially
useful repositories present on [my github](https://github.com/sombriks?tab=repositories)

Therefore, i'll add here not only _finished_ solutions, but also my exploration
projects.

## [node-libgpiod](https://github.com/sombriks/node-libgpiod)

This project is a wrapper for libgpiod to nodejs. By the time i decided to build
a simple remote-controlled car-robot i decided to not use outdated raspberry pi
OS but a modern fedora for arm system.

It happens to fedora does not ships with old gpio library from kernels, but only
userland-safe libgpiod.

So i wrote the C++ wrapper code to make nodejs speak with this general
input/output interface and put that on npm registry

This project is open for contributions, ;-)

## [koa-api-builder](https://github.com/sombriks/koa-api-builder)

A [Koa](https://koajs.org) library to build apis, heavily inspired on
[Javalin](https://javalin.io).

I felt the need on some of my personal projects, did a quick search on
[Koa ecosystem](https://github.com/koajs/koa/wiki#routing-and-mounting) but
found nothing like what i wanted.
[So i opened a pull request](https://github.com/koajs/router/pull/167).

But the PR did more sense as an independent library so this experiment came to
life.

## [koa-webc middleware](https://github.com/sombriks/koa-webc)

Small middleware to render [WebC](https://github.com/11ty/webc) components from
the node [Koa](https://koajs.com/) server.

This one exists mostly because Koa is the next thing after express and WebC is
quite beautiful and simple to use.

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
might finally getting traction and the server side capabilities of WebC can help
even further to fast track the adoption.

## [simple-knex-koa-example](https://github.com/sombriks/simple-knex-koa-example)

A template project in case someone (mostly me, I and myself!) needs a quickstart
backend node project.

## [palavrim](https://github.com/sombriks/palavrim)

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

## [rosetta-beer-store](https://github.com/sombriks/rosetta-beer-store)

This is a very cool test project. Here i redo several times interchageable
clients and services, proving that separation offers such great degree of
transparency between solution layers but also producing some comments on which
approach is simper, which one is easier, and who gets more performance. It's a
must-see if you're in the process to choose technologies for your next big thing.

## [my-golang-handbook](https://github.com/sombriks/my-golang-handbook)

I gathered all my [golang](https://go.dev/) studies into one single easy to
understand repository.

## [react-studies](https://sombriks.github.io/react-studies/)

My small react study project.

## [sample-firebase](https://github.com/sombriks/sample-firebase)

A template project for those who wants to combine the power of vue and firebase.

Everything is sampled, even the local environment for firebase.

The template can be very useful, a good reference on how to proper setup a
firebase project.

## [game _inspirator_](https://sombriks.github.io/random-game-inspirator/#/inspirator)

Small experiment to test [dexie.js](https://dexie.org/) database.

## [vue-openlayers](https://github.com/sombriks/vue-openlayers)

Back in time i did this cool openlayers wrapper for vue2 to use on some
hybrid-mobile applications i wrote during my startup days at
[thechpar](https://github.com/techpar).

Its archived but still a nice piece of code and now a snapshot of a past time
where javascript was still experimenting strong growth pains on its bones.

## _more to come_

This list is a work in progress, if i create something new or find some
cabalistic git repo of mine worth to land here it will appear eventually.
