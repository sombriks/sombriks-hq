---
layout: base.webc
tags: posts
date: 2022-09-24
---
# Using GNU Make as your preferred javascript build tool

So, [Make](<https://en.wikipedia.org/wiki/Make_(software)>) was created a long
long time ago and the tales told us that it's destined to be recreated again
and again over the eons, because people don't understand how make works.

[Ant](https://ant.apache.org/), [SCons](https://en.wikipedia.org/wiki/SCons)
and others exists because people didn't understood make.

For [Maven](https://maven.apache.org/) and [Gradle](https://gradle.org/)
we open a small exception since they do more than build.

What we cannot forgive is mistakes like [gulp](https://gulpjs.com/) and
[grunt](https://gruntjs.com/).

You see, there is a reason to use specialized
[DSL's](https://en.wikipedia.org/wiki/Domain-specific_language) instead general
purpose languages to build complex projects.

You need to be objective.

You need to be simple.

Make do this since the dancing days.

Even yet javascript people got too puzzled that decided to make things
on their own.

Enough talk, look at this:

```Makefile
# Makefile
export PATH := ./node_modules/.bin:$(PATH)

clean:
  rm -rf public

prepare:
  mkdir public

build: clean prepare
  browserify src/main.js -p common-shakeify -o tmp.js
  uglifyjs tmp.js --compress  --verbose > public/build.js
  cp index.html public/index.html
  cp -r assets public/assets
  rm -rf tmp.js

release: build
  firebase deploy

dev:
  budo src/main.js:build.js --live --wg="**.{html,css,js,vue,md}" --open -H 127.0.0.1
```

And of course you call it invoking make and a target, for example:

```bash
make build
```

The line setting up the `$PATH` is just to make sure the non-global tools
inside the node_modules/.bin will be found.

Wanna see the same thing with gulp?

```javascript
// gulpfile.js
const gulp = require("gulp"); // npm i gulp --save-dev
const budo = require("budo"); // npm i budo --save-dev
const del = require("del"); // npm i del --save-dev
const browserify = require("browserify"); // npm i browserify --save-dev
const fs = require("fs"); // built-in node fs module

const dev = cb => {
  budo("./src/main.js", {
    serve: "build.js",
    live: true,
    open: true,
    host: "127.0.0.1",
    stream: process.stdout,
    watchGlob: "**.{html,css,js,vue,md}",
  });
  cb();
};

const clean = cb => {
  del("public").then(_ => {
    fs.mkdirSync("public");
    cb();
  });
};

const build = cb => {
  browserify({
    entries: "src/main.js",
  })
    .bundle()
    .pipe(fs.createWriteStream("public/build.js"));
  fs.copyFileSync("assets", "public/assets");
  fs.copyFileSync("index.html", "public/index.html");
  cb();
};

const release = cb => {
  cb();
  // not implemented yet. maybe never.
};

exports.dev = dev;
exports.clean = clean;
exports.build = gulp.series(clean, build);
exports.release = gulp.series(clean, build, release);
```

To make it work you'll need these dev dependencies:

```bash
npm install --save-dev gulp
```

In order to see it happening, hit your bash with this command:

```bash
npx gulp build
```

And that's it, twice lines of code for half functionality seen on Makefile.

_Please don't ask me for the Grunt version._

The only serious caveat to pay attention when adopting Make is windows.

But a windows development environment for modern web will always present exotic
challenges. Like
[the maximum path size](https://docs.microsoft.com/en-us/windows/desktop/fileio/naming-a-file#maximum-path-length-limitation)

## Conclusion

So, if someone asks you to set-up grunt or gulp for a brand new project,
**please don't**.

2019-01-04
