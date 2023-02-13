---
layout: base.webc
tags: posts
date: 2017-12-04
---
# About this 'Blog Engine'

**Update 2023-02-13:** Now it uses an engine, it's [eleventy](https://www.11ty.dev/)

**Update 2020-05-27:** we don't use axios or brfs anymore. or browserify.
The new 'engine' is [es6 imports](https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import) in a vue-cli generated project.

This is not an engine at all.

All i need is to display a few markdown files, just render them and i'm done. Call it a day.

The real hero there is called [marked](https://www.npmjs.com/package/marked). It renders the html from markdown documents.

All we do is a xhr request using [axios](https://github.com/axios/axios), send it to marked and voilá! There is no real difference between make a post and a markdown file.

I am also using [vue-router](https://router.vuejs.org/en/essentials/dynamic-matching.html) capabilities to find the correct markdown file.

The nice trick however is how to list the existing files. we're on the internet. There is no 'ls' command.

But i use browserify to build this place. and browserify tries to make you feel in the browser as if you where in node runtime.

One special transform is [brfs](https://github.com/browserify/brfs), which allows you to statically list files and directories and cache them.

Therefore i can list them at build time and keep this index to dynamically load posts at runtime.

So, we did a blog engine using vue, vue-router, marked, axios, browserify and brfs.
