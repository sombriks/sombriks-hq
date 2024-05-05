---
layout: blog-base.webc
tags:
  - posts
  - htmx
  - bld
  - maven
  - gradle
  - rife2
  - spring
  - sdkman
  - java
  - build tools
  - github actions
  - project setup
  - project structure
  - project management
date: 2024-05-05
draft: true
---
# Build with bld and why it matters to the jvm ecosystem

In [previous][previous1] [articles][previous2] we discussed how to structure a
java project and like [this guide here][previous3] we started naive and grew in
complexity more and more.

But complexity is bad, it tends to just add up.

In this article we'll discuss a new tool, which uses both the state of the art
and a very pragmatic way of thinking when it comes to the problem of manage a
java/jvm project.

My friends, let's talk about [bld][bld].

## What is bld anyway?

I was lurking in the internet when i hit this [Adam Bien][abien]'s
[podcast episode][airhacks] and got hooked: so that small command he was using
wasn't a custom, personal, script to relieve the pain. It was a dedicated tool.

Curiosity grew and i decided to try it. Now here we are, writing advice for me,
for new java adopters and for other old, seasoned and weary java architects out
there.

In very short words, bld create and manage jvm-based projects.

The key difference, for example, from [maven][maven], it uses
**java language itself** to manage the project construction and dependencies.

That puts bld closer to what [gradle][gradle] does, but unlike this one, bld is
simpler, focused on the goal of just build things up and build it right.

What? how does it compares to [ant][ant]?

Compared with ant, bld is simple and does more. Both has 3 letters.

### How good is it?

Well, so far the single evidence that bld is cool and good is my word. so let't
take a closer look:

### Installation

For any of those tools mentioned here, there is a tool to help install them and
it's called [sdkman][sdkman].

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

Once it's installed, proceed to install bld:

```bash
sdk install bld
```

## Simple hello world

## But does it really shine?

## Conclusion

[previous1]: 0036-how-to-structure-a-java-project
[previous2]: 0057-how-to-structure-a-java-project-part-2
[previous3]: https://github.com/sombriks/enterprise-kotlin-handbook
[bld]: https://rife2.com/bld
[abien]: https://www.youtube.com/@bienadam
[airhacks]: https://adambien.blog/roller/abien/entry/no_dependencies_or_how_rife
[maven]: https://maven.apache.org/
[gradle]: https://gradle.org/
[ant]: https://ant.apache.org/
[sdkman]: https://sdkman.io/install
