# About this 'Blog Engine'

This is not a engine at all.

All i need is to display a few markdown files, just render them and i'm done. Call it a day.

The real hero there is called [marked](https://www.npmjs.com/package/marked). It renders the html from markdown documents.

All we do is a xhr request using [axios](https://github.com/axios/axios), send it to marked and voilá! There is no real difference between make a post and a markdown file.

I am also using [vue-router](https://router.vuejs.org/en/essentials/dynamic-matching.html) capabilites to find the correct markdonw file.

The nice trick however is how to list the existing files. we're on the internet. There is no 'ls' command. 

But i use browserify to build this place. and browserify tries to make you feel in the browser as if you where in node runtime.

One special transform is [brfs](https://github.com/browserify/brfs), which allows you to statically list files and directories and cache them.

Therefore i can list them at build time and keep this index to dynamically load posts at runtime.   

So, we did a blog engine using vue, vue-router, marked, axios, browserify and brfs.

2017-12-04
