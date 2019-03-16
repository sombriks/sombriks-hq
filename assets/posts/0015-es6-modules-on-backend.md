# ES6 modules on backend

This is a really quick yet nice one regarding backend.

## TL;DR

Bootstrap a brand new and ordinary node/npm project

```bash
# requires npm 6.x at least
npm init esm -y
```

By issuing `npm init esm -y` two template files will be created too.

The app es6 bootstrap:

```javascript
// index.js

// Set options as a parameter, environment variable, or rc file.
require = require("esm")(module/*, options*/)
module.exports = require("./main.js")
```

And the es6-enabled entry, where you can do things like this:

```javascript
// main.js

import express from "express"

export const app = express()

// ...
```

## The not that long story

Back in time Node adopted [CommonsJS](https://en.wikipedia.org/wiki/CommonJS)
module strategy and everyone was happy.

But then client side javascript got that boom in evolution, got bundlers, const,
promises, and also a
[module proposal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

There is when problems begin, because thanks to bundlers like
[browserify](http://browserify.org) frontend people already was happy writing
`require/exports` everywhere.

But of course people made meetings, talked each other and made an agreement and
node itself will handle both styles of module management. Soon or later.

By the day of this writing, you can already use native `import/export` on your
node backend as explained [here](https://nodejs.org/api/esm.html#esm_enabling).

## How to put it on my project

Let's say that you already have an app more or less like this one.



2019-03-16
