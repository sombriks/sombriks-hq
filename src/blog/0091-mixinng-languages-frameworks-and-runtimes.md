---
layout: blog-layout.pug
tags:
  - posts
  - misc
  - parcel
  - eleventy
  - gradle
  - java
  - kotlin
date: 2026-06-07
draft: false
---
# Mixing things up

One good practice when dealing with complex systems is to keep cognitive load
down. Use one single language, one framework and a well known runtime. This
article is an experiment exploring the opposite of this recommendation. 

## Why to mix several technologies

To be more accurate, polyglot projects are the norm for a long time now.
[The Unix Way][unix-way] isn't present on large software projects anymore.

[unix-way]: https://en.wikipedia.org/wiki/Unix_philosophy

We mix technologies to produce something bigger.

We should not mix, however, overlapping technologies. There should be just one
language or framework best suited for frontend/ui, one for backend/business
logic and one for direct data management. 

In a way, the distinct technologies are not mixed. Yet here they are, in the
same project, with distinct build strategies, producing one single solution.

## Tools to mix things up

When building a modern web application, the output usually is html, javascript
and css. But the ways to achieve that, well, those vary a lot.

### Web frontend

It is possible, in order to get productivity, add another degree of indirection
by adopting a javascript framework like Angular, React, Svelte or Vue. 

Those frameworks may or may not demand a dedicated cli tool to make development
possible.

So, how to mix those web frameworks?

Mo perfect solution so far, bu [parcel][parcel] comes closer.

[parcel]: https://parceljs.org/

Since it supports multiple entry points and rely heavily on urls to decide how
to transform the resources, it is possible to mix not only frameworks but also
languages (javascript and typescript) with little friction.

### Static templates

Another scenario is static or dynamic content generation on the server side.
Although the previous listed frameworks offer some capabilities on this, they
are not the best suited ones for that.

Template languages able to render html and css are the ones for this use case,
sucha as pug, thymeleaf, markdown, nunjucks and others.

Aside dedicated server side engines to deliver it on demand, the tool to render
any template written in almost any language is the [eleventy][eleventy] static
generator.

[eleventy]: https://11ty.dev

### Server side runtimes

For servers, things get messy.

Java projects can be configured to also support Groovy and Kotlin almost
out-of-the-box if [gradle][gradle] is the build tool.

[gradle]: https://gradle.org

It is possible to mix C and C++ in [node.js projects][node-napi] with little
friction.

[node-napi]: https://nodejs.org/api/n-api.html

## Conclusion

In the end, the best approach is to try to keep thing simple as long as you can.

Complexity will come anyway, don't rush into it.

Happy Coding!
